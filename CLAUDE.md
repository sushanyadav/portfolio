# Project Instructions

## Figma MCP Tools

When using Figma MCP tools, **always check the active skill file first** for specific tool instructions.

**Important:** `get_design_context` returns structural metadata (frames, positions, text) but does NOT include color values. All colors come from `get_variable_defs`.

- **page-layout skill**: Use ONLY `get_screenshot` (never `get_design_context` - causes token limit errors)
- **tailwind-theme-config skill**: Use `get_variable_defs` for colors/tokens + `get_screenshot` for verification. `get_design_context` is optional (only for asset export)
- **Other skills**: Follow the skill's specific instructions for which Figma tools to use
