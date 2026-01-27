# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChatGPT Challenge is a minimal ChatGPT web app clone built with React and Express that demonstrates core chat functionality including message editing, deletion, and real-time streaming responses. This project serves as the foundation for three tutorial articles on advanced features (folder attachments, automations, multi-threaded conversations) and as a code challenge for Product Managers to fork and extend with their own creative features.

## Development Guidelines

- Limit comments inside the code
- Test all changes before marking complete
- Prefer to run single tests and not the whole suite for performance reasons
- Keep animations simple and working
- Focus on code clarity and extensibility for Product Manager audience
- Maintain clean separation between frontend and backend
- Follow React hooks patterns with functional components
- Keep component responsibilities single and focused

## Important Notes

**Credentials & API Keys:**
Any time there are credentials, API keys, etc make sure to store them in a `.env` file. Never commit `.env` files. Always provide `.env.example` templates.

**Windows Compatibility:**
Make sure all commands work within Windows terminal; this is being developed locally on Windows

**Git Repository:**
This repository will be shared publicly as a learning resource and code challenge. Do not git push unless explicitly asked. You may git commit on my behalf. Ensure no credentials are ever committed.

**Target Audience:**
Code is written for Product Managers who may have varying technical backgrounds. Keep implementations clear and avoid over-engineering. Comments should explain "why" not "what."

## Project Memory Folder

The Project Memory folder is key to understanding the project and allows you to continue effectively.

**Core Files:**
- `product-spec.md` - All core requirements and goals, including the three planned tutorial features
- `technical-spec.md` - Key technical design decisions and system patterns to stay consistent
- `progress.md` - Current work focus, recent changes, what's left to build, current status and known issues

**Project Memory Updates occur when:**
- Discovering new project patterns
- After implementing significant changes
- When user requests with "update proj memory" (MUST review all files)
- After completing major phases of work
- When technical decisions are made

**Note:** When triggered by "update proj memory", review every memory bank file, even if some don't require updates. The project memory must be maintained with precision and clarity as effectiveness in building the project depends on it.

## Tutorial Documentation

**tutorial.md** - This file contains the Substack tutorial article being written alongside development. It's designed for Product Managers learning how to build chat applications.

**When to update tutorial.md:**
- After completing major implementation milestones
- When user requests "update proj memory" (update tutorial alongside specs)
- After making architectural decisions worth documenting
- When discovering insights or lessons worth sharing

**Tutorial writing style:**
- Conversational and approachable for PM audience
- References the foundational article: https://bonnieyu.substack.com/p/building-an-ai-pm-interview-site
- Focuses on "why" behind decisions, not just "what" was built
- Includes practical examples and use cases
- Documents lessons learned and key takeaways
