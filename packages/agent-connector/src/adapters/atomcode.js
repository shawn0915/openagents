/**
 * AtomCode adapter — AtomGit GLM OpenAI-compatible chat completions.
 *
 * Reuses LlmDirectAdapter's streaming chat-completions client, but:
 *  - reads ATOMCODE_API_KEY (also accepts LLM_API_KEY / OPENAI_API_KEY)
 *  - reads ATOMCODE_BASE_URL / LLM_BASE_URL / OPENAI_BASE_URL, defaulting to https://api.atomsites.cn/v1
 *  - reads ATOMCODE_MODEL / LLM_MODEL, defaulting to glm-5.1
 *
 * Priority for every value: UI-saved env > process env > default.
 * Stop / status / control flow is inherited from BaseAdapter.
 */

'use strict';

const LlmDirectAdapter = require('./llm-direct');

const DEFAULT_BASE_URL = 'https://api.atomsites.cn/v1';
const DEFAULT_MODEL = 'glm-5.1';

class AtomCodeAdapter extends LlmDirectAdapter {
  constructor(opts) {
    super({
      ...opts,
      adapterLabel: 'AtomCode',
      modelEnvVar: 'ATOMCODE_MODEL',
      suppressConfigLog: true,
    });

    const env = this.agentEnv || process.env;

    const apiKey =
      env.ATOMCODE_API_KEY ||
      env.LLM_API_KEY ||
      env.OPENAI_API_KEY ||
      '';

    const baseUrl = (
      env.ATOMCODE_BASE_URL ||
      env.LLM_BASE_URL ||
      env.OPENAI_BASE_URL ||
      DEFAULT_BASE_URL
    ).replace(/\/$/, '');

    const model =
      env.ATOMCODE_MODEL ||
      env.LLM_MODEL ||
      DEFAULT_MODEL;

    this._apiKey = apiKey;
    this._baseUrl = baseUrl;
    this._model = model;
    this._directMode = !!(this._apiKey && this._baseUrl);

    if (this._directMode) {
      this._log(`AtomCode mode: ${this._baseUrl} model=${this._model}`);
    } else {
      this._log(
        'AtomCode adapter started without API key. ' +
        'Set ATOMCODE_API_KEY via the Launcher Configure screen.'
      );
    }
  }
}

module.exports = AtomCodeAdapter;
