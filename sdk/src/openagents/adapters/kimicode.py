"""
Kimi Code adapter for OpenAgents workspace — Moonshot AI Kimi Code API.

Mirrors packages/agent-connector/src/adapters/kimicode.js. Reuses the streaming
chat-completions client from NanoClawAdapter but applies Kimi Code-specific
defaults (base URL https://api.moonshot.cn/v1, model kimi-k2) and accepts
KIMICODE_API_KEY / MOONSHOT_API_KEY in addition to the generic LLM_*/OPENAI_*
variables.

Priority for every value: UI-saved env > process env > default.
"""

import logging
import os

from openagents.adapters.nanoclaw import NanoClawAdapter
from openagents.workspace_client import DEFAULT_ENDPOINT

logger = logging.getLogger(__name__)

DEFAULT_BASE_URL = "https://api.moonshot.cn/v1"
DEFAULT_MODEL = "kimi-k2"


class KimiCodeAdapter(NanoClawAdapter):
    """Kimi Code (Moonshot) adapter — OpenAI-compatible chat completions."""

    def __init__(
        self,
        workspace_id: str,
        channel_name: str,
        token: str,
        agent_name: str,
        endpoint: str = DEFAULT_ENDPOINT,
        disabled_modules: set | None = None,
        working_dir: str | None = None,
    ):
        super().__init__(
            workspace_id,
            channel_name,
            token,
            agent_name,
            endpoint,
            disabled_modules,
            working_dir,
        )

        # Override direct-mode config with Kimi Code-specific env vars
        self._direct_api_key = (
            os.environ.get("KIMICODE_API_KEY")
            or os.environ.get("MOONSHOT_API_KEY")
            or os.environ.get("LLM_API_KEY")
            or os.environ.get("OPENAI_API_KEY")
            or ""
        )
        self._direct_base_url = (
            os.environ.get("KIMICODE_BASE_URL")
            or os.environ.get("LLM_BASE_URL")
            or os.environ.get("OPENAI_BASE_URL")
            or DEFAULT_BASE_URL
        ).rstrip("/")
        self._direct_model = (
            os.environ.get("KIMICODE_MODEL")
            or os.environ.get("LLM_MODEL")
            or DEFAULT_MODEL
        )
        self._direct_mode = bool(self._direct_api_key and self._direct_base_url)

        if self._direct_mode:
            logger.info(
                f"Kimi Code mode: {self._direct_base_url} model={self._direct_model}"
            )
        else:
            logger.warning(
                "Kimi Code adapter started without API key. "
                "Set KIMICODE_API_KEY (or MOONSHOT_API_KEY) via the Launcher Configure screen."
            )
