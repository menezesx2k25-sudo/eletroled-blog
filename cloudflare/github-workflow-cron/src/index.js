const GITHUB_API_VERSION = '2026-03-10';

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(dispatchWorkflow(env, `cron:${controller.cron}`));
  },

  async fetch() {
    return json({
      ok: true,
      service: 'eletroled-blog-publisher-cron',
      message: 'Use Cloudflare Cron Trigger to dispatch the GitHub workflow.'
    });
  }
};

async function dispatchWorkflow(env, source) {
  const config = readConfig(env);
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/actions/workflows/${encodeURIComponent(config.workflowId)}/dispatches`;
  const payload = {
    ref: config.ref,
    inputs: {
      count: config.count,
      once_per_day: 'true'
    }
  };

  const response = await retry(() => fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'eletroled-blog-publisher-cron',
      'X-GitHub-Api-Version': GITHUB_API_VERSION
    },
    body: JSON.stringify(payload)
  }));

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub workflow_dispatch failed (${response.status}) from ${source}: ${body}`);
  }

  const body = await response.text();
  console.log(`GitHub workflow_dispatch accepted from ${source}: ${response.status} ${body}`);
}

function readConfig(env) {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN secret.');
  }

  return {
    token,
    owner: env.GITHUB_OWNER || 'menezesx2k25-sudo',
    repo: env.GITHUB_REPO || 'eletroled-blog',
    workflowId: env.GITHUB_WORKFLOW_ID || 'publish-scheduled.yml',
    ref: env.GITHUB_REF || 'main',
    count: env.PUBLISH_COUNT || '1'
  };
}

async function retry(operation, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await operation();
      if (response.ok || !isRetryableStatus(response.status) || attempt === attempts) {
        return response;
      }
      lastError = new Error(`Retryable HTTP status ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        throw error;
      }
    }

    await sleep(500 * attempt);
  }

  throw lastError;
}

function isRetryableStatus(status) {
  return status === 408 || status === 429 || status >= 500;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
