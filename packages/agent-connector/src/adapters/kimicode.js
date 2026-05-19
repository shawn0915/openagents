/**
 * Kimi Code adapter — Moonshot AI Kimi Code OpenAI-compatible chat completions.
 *
 * Reuses LlmDirectAdapter's streaming chat-completions client, but:
 *  - reads KIMICODE_API_KEY / MOONSHOT_API_KEY (also accepts LLM_API_KEY / OPENAI_API_KEY)
 *  - reads KIMICODE_BASE_URL / LLM_BASE_URL / OPENAI_BASE_URL, defaulting to https://api.moonshot.cn/v1
 *  - reads KIMICODE_MODEL / LLM_MODEL, defaulting to kimi-k2
 *
 * Priority for every value: UI-saved env > process env > default.
 * Stop / status / control flow is inherited from BaseAdapter.
 */

'use strict';

const LlmDirectAdapter = require('./llm-direct');

const DEFAULT_BASE_URL = 'https://api.moonshot.cn/v1';
const DEFAULT_MODEL = 'kimi-k2';

class KimiCodeAdapter extends LlmDirectAdapter {
  constructor(opts) {
    super({
      ...opts,
      adapterLabel: 'Kimi Code',
      modelEnvVar: 'KIMICODE_MODEL',
      suppressConfigLog: true,
    });

    const env = this.agentEnv || process.env;

    const apiKey =
      env.KIMICODE_API_KEY ||
      env.MOONSHOT_API_KEY ||
      env.LLM_API_KEY ||
      env.OPENAI_API_KEY ||
      '';

    const baseUrl = (
      env.KIMICODE_BASE_URL ||
      env.LLM_BASE_URL ||
      env.OPENAI_BASE_URL ||
      DEFAULT_BASE_URL
    ).replace(/\/$/, '');

    const model =
      env.KIMICODE_MODEL ||
      env.LLM_MODEL ||
      DEFAULT_MODEL;

    this._apiKey = apiKey;
    this._baseUrl = baseUrl;
    this._model = model;
    this._directMode = !!(this._apiKey && this._baseUrl);

    if (this._directMode) {
      this._log(`Kimi Code mode: ${this._baseUrl} model=${this._model}`);
    } else {
      this._log(
        'Kimi Code adapter started without API key. ' +
        'Set KIMICODE_API_KEY (or MOONSHOT_API_KEY) via the Launcher Configure screen.'
      );
    }
  }
}

module.exports = KimiCodeAdapter;
