Building an AI PM Interview Site with Claude Code
Getting Started with Claude Code and Development Workflows for Product Managers

This tutorial will help you get you going with Claude Code (+ VS Code) and some basic development workflows and best practices. If you’re a non-technical Product Manager, Claude Code can feel intimidating at first with the terminal and all the surrounding “developer stuff.”

The goal of this guide is to lower that barrier. 

The project we are building will be an AI PM Interview prep website. It will include a small collection of real AI PM interview questions that people have reported, plus some curated resources for learning key AI topics. The project itself is intentionally simple; the point isn’t to build something fancy, it’s to get comfortable working in a real codebase with Claude Code (CC).
Claude Code vs. Lovable/Replit/Bolt/etc
Before jumping in, let’s talk about why Claude Code, and when to use CC. 

If you are building a simple app, a weekend project where you’re going to throw away the code, Lovable/Replit/Bolt etc are great for the job. They’re extremely easy to get started with, and they handle a lot of things for you automatically, like hosting and setup.

But if you’re building something more complex, or something you plan to keep working on over time, Claude Code is worth considering. It gives you more control, and it scales much better as your project grows.

Here’s the 3 reasons why I choose CC:
Cost - Claude Code is part of Anthropic’s pro plan which I already pay for, so instead of paying for another tool I can simply use CC. OpenAI similarly gives you Codex CLI for their Pro plan 
Better at Coding - CC is generally agreed on as a better coding agent than Lovable or Bolt’s. So if you have a more complexity in the app, then I’d pick CC otherwise you’ll find yourself fighting more bugs
Control and Technology Choice - Lovable uses Javascript, Replit uses Typescript. It locks you into a specific tech stack. If you want to build a native iOS app (which is written in Swift or Objective C), then that’s a problem. With CC, you can use any language or framework you want. You have more freedom
Installing and Setting Up
Claude Code can be used in all sorts of places. You can use it purely in terminal only, use it in Cursor, in Replit, in Claude Desktop or Claude Code Web. 

In this guide, I’m going to use Claude Code inside VS Code. If you don’t know, VS Code is a very popular code editor (IDE), in fact Cursor and Windsurf are forks of it! You’ll be able to easily compare code diffs, integrate with your versioning system, etc. The best part is it’s FREE.

Install Claude Code
Go to your terminal and type in: 
curl -fsSL https://claude.ai/install.sh | bash

Install VS Code  
Download for your system here: https://code.visualstudio.com/docs/setup/setup-overview

Install Claude Code Extension in VS Code
In VS Code, go to Extensions panel and download and install the Claude Code Extension. This gives you tighter integration and a nicer UI for working with Claude Code.

Click on   icon in the left sidebar to open the Extensions panel

Getting Oriented with Claude Code and VS Code

Understanding the VS Code Layout

Before we start building anything, it’s worth getting oriented in the UI.

Explorer  - This is where you can see all your folders and files for your project
Claude Code Icon  - Once the extension is installed, you can access Claude Code in the Sidebar 

Using Claude Code


The sidebar version of Claude Code has a nicer UI and is generally more user-friendly.

Note: on Windows, the Claude Code sidebar can be a bit buggy, so in many places I’ll show screenshots using the terminal version instead.

If you also want to use terminal,
Go to Terminal in the top navigation 
Click New Terminal 
Type Claude in the directory you want to work in

The directory you open Claude in is where CC will have access to update your files.


   
Connect Claude Code to Your Anthropic Account


First Things First: Model Selection
Next, let’s look at which model to use for CC. As of this writing, Anthropic offers three main models you’ll use with Claude Code: Opus, Sonnet, and Haiku. You can switch between them directly inside Claude Code by 

Typing: /model





At the moment, Claude Code defaults to Opus 4.5. In the past, it used to default to Sonnet because earlier versions of Opus were extremely expensive in terms of token usage. Opus 4.1, for example, would burn through tokens so quickly that it was basically unusable on the Pro plan.

That changed with Opus 4.5.

Anthropic greatly reduced the cost of tokens, from $15/$75 (input/output) per million tokens on Opus 4.1 to $5/$25 for Opus 4.5. According to Anthropic, Opus 4.5 uses less tokens than Sonnet 4.5, so theoretically you should use Opus 4.5 all the time.  

My recommendation: start with Opus 4.5. If you run into rate limits, latency issues, or cost concerns, then experiment with Sonnet or Haiku. It’s very easy to switch later.

One important meta-point here: AI tooling moves fast. Defaults change. Pricing changes. Model behavior changes. You can’t rely forever on a recommendation from a tutorial. Get in the habit of trying things yourself and checking current docs.

FYI This is how it looks on sidebar view

Planning Your Project - The Product Spec

Now that we’ve picked a model, let’s do something very PMy: write a spec. When working with a LLM, a lot of the work you need to do is produce a spec so the LLM knows what to build.

We’re going to work with Claude to generate a lightweight product spec before writing any code.

This is an intentionally simple project for the sake of the tutorial. The only piece of complexity I’ve added to this is fetching questions from a Google sheet. If you want to simplify even further, you could ask Claude to generate a handful of sample questions and store them locally for example, in a JSON file. That’s totally fine for learning purposes.

For now, we’ll treat this like a real (but small) product.

Prompt: Creating the Product Spec
Here’s the prompt I use to generate the initial spec. You can copy and paste this directly into Claude Code.
____________________________________________________________________________

Write a spec for an AI PM Interview Prep website. Create a new folder called “Project Memory” and output the spec “product-spec” as a markdown file.The goal is to help product managers practice for AI PM interviews. A few quick requirements to get us going

Responsive design for desktop and mobile
Two pages:
1: Shows Interview Question for PMs to practice against
2: A  list of free resources including top AI companies hiring
Interview Question Page
Questions
Source questions from https://docs.google.com/spreadsheets/d/1tNUIgrWR_e9BOLioJmAxqvi-BOIV6C8X4UfF8zWDUWk/edit?usp=sharing
Display one randomly selected question at a time
Include "Next Question" button to fetch new random questions
Show question category
Question filtering by category
Use local storage to track practiced questions
Timer
Show the user a timer from when the question is shown
Toggle visibility option (show/hide)
User Contribution
Prominent "Submit a Question" button linking to: https://docs.google.com/forms/d/e/1FAIpQLSekX2c8CHa9LWY91kBVMg5lNCqkLUvQWJ9zyv8OZkaZ2UOB3Q/viewform
Brief instruction text explaining community contributions
AI Resource Page
Top AI Companies Hiring - Curated list with company names and career page links
Topic-Based Resources - Grouped by key concepts (e.g., MCP, RAG, Fine-tuning, AI Ethics)
Each resource should include: title, brief description, and link

Please ask me any clarifying questions 
____________________________________________________________________________

Why I always end with clarifying questions
I always end with “Please ask me any clarifying questions.” This is intentional.

Even for a small project, there are almost always a few details I’ve missed or underspecified. Asking for clarifying questions gives Claude a chance to surface ambiguities early, and it helps align us before any real work starts.

In practice, Claude will usually ask a handful of sensible questions about scope, behavior, or edge cases. Taking a few minutes to answer them upfront saves a lot of back-and-forth later.

Screenshot of Claude asking follow up questions


At this point, you should have a product-spec.md file in a Project Memory folder. 
Keeping Project Memory Across Sessions
Why did I create a product-spec.md and this project memory folder?

Claude Code resets most of its context between sessions. When you close a terminal or start a new Claude session, it does not reliably remember what you worked on last time, what decisions you made, or what’s left to build. That can get frustrating and cause more bugs as you work on your project.
Project Memory: How We Persist Information
I use a simple system to maintain information about the project across sessions. Inside the project folder, I keep a Project Memory directory with three markdown files:

product-spec.md — the core product requirements and goals
technical-spec.md — key technical decisions and system patterns
progress.md — what we’re working on now, what’s done, what’s left, and known issues

We’ve already started with product-spec.md. After Claude generates the spec, I usually review it, make any edits I agree or disagree with, and then ask Claude to create the technical-spec.md and progress.md files next.
How Claude Uses Project Memory with Claude.md 
Now let’s talk about how Claude knows to read and respect these files.

Claude Code automatically reads a special file called Claude.md at the start of every session. This makes it the perfect place to give Claude durable instructions about how to work in your repository.

Tip: Per Anthropic’s best practices guide, Claude.md is ideal for documenting things like

Quote
Common bash commands
Core files and utility functions
Code style guidelines
Testing instructions
Repository etiquette (e.g., branch naming, merge vs. rebase, etc.)
Developer environment setup (e.g., pyenv use, which compilers work)
Any unexpected behaviors or warnings particular to the project
Other information you want Claude to remember

In our case, Claude.md is also where we tell Claude how to use the Project Memory folder.
Creating Claude.md
To create Claude.md, you have two options:
Use /init
Create the file yourself  

/init  – this will let Claude generate its own Claude.md based on the current code base and whatever is in the directory

I have a Claude.md that includes my common instructions that I usually use. You can save the parts you like for every project in the global Claude.md which can be found:
macOS / Linux: ~/.claude/CLAUDE.md
Windows: C:\Users\<your-username>\.claude
What’s Inside My Claude.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview


You are an engineer for a website to help product managers prepare for AI PM interviews. This means interviewing for top AI companies or for PM roles at any company working on AI products. The site features a question practice page with timer functionality and an AI resources page with curated learning materials and company links.


## Development Guidelines


- Limit comments inside the code
- Test all changes before marking complete
- Prefer to run single tests and not the whole suite for performance reasons
- Keep animations simple and working


## Important Notes


**Credentials & API Keys:**
Any time there are credentials, API keys, etc make sure to store them in a `.env` file


**Windows Compatibility:**
Make sure all commands work within Windows terminal; this is being developed locally on Windows


## Project Memory Folder


The Project Memory folder is key to understanding the project and allows you to continue effectively.


**Core Files:**
- `product-spec.md` - All core requirements and goals
- `technical-spec.md` - Key technical design decisions and system patterns to stay consistent
- `progress.md` - Current work focus, recent changes, what's left to build, current status and known issues


**Project Memory Updates occur when:**
- Discovering new project patterns
- After implementing significant changes
- When user requests with "update proj memory" (MUST review all files)


**Note:** When triggered by "update proj memory", review every memory bank file, even if some don't require updates. The project memory must be maintained with precision and clarity as effectiveness in building the project depends on it.


At this point, your project should look roughly like this:

Folder Structure


This setup is a bit heavyweight for such a small project. But for bigger projects, Claude will be more consistent across sessions especially around the engineering patterns (in technical-spec.md) so you have less bugs. It’s also easier to build the project in increments when the phases are clearly defined (in the progress.md).
Once this structure is in place, building becomes smoother.
Architecting your App with Plan Mode
Next, we are going to use plan mode to architect your app. In more complex projects, it’s worth spending time on the architecture for scalability and extensibility so you don’t end up with a pile of spaghetti code. 

Claude Code has a feature called Plan Mode, which is designed specifically for this kind of deep thinking and structured planning. Instead of jumping straight into implementation, Plan Mode encourages Claude to reason through architecture, tradeoffs, and sequencing first.

To enter Plan Mode in Claude Code, press Shift + Tab and cycle through the modes until you see Plan Mode enabled.

A Note on “Ultrathink”
In the past, a common tip was to pair Plan Mode with the keyword “ultrathink” to encourage maximum token usage and more detailed reasoning.
As of mid-January 2025, it appears that:
“ultrathink” is no longer explicitly supported
Maximum token usage now seems to be the default behavior in Plan Mode
There wasn’t a formal announcement from Anthropic, so this may change again. This is another good reminder that AI tooling evolves quickly.

Generating the Plan: Google Sheets API Integration 
With Plan Mode enabled, here’s a simple prompt I used to kick off the discussion:

_____________________

Break down Phase 1 into smaller tasks that can be tested and validated. Architect a plan for building the google sheets API integration for review. Optimize for simplicity, testability, clean separation of concerns, and security

_________________

Note: If you are building a project, you want to ship and maintain, you can try “Architect a production-grade, phased plan”

Claude’s output will usually be structured and fairly detailed. Here’s a simplified version of what it produced for the Google Sheets integration.
_______________________________________________

Google Sheets API Integration - Deep Dive Architecture                                                                                           
Core Strategy:                                                                                                                                   Build the API integration layer first as an isolated, testable module before connecting to React components.                                    
                                                                                                                                                    
    Key Architectural Decisions:                                                                                                                    
    1. Separation of Concerns: Create a dedicated services/googleSheets.js module                                                                   
    2. In-Memory Cache: Use a simple JS object with timestamp for 1-hour TTL                                                                        
    3. Error Recovery: Multi-layer fallback (cache → retry → error state)                                                                           
    4. Data Transformation: Raw sheet data → normalized question objects with generated IDs                                                         
                                                                                                                                                    
    API Integration Steps (7 testable tasks):                                                                                                       
                                                                                                                                                    
    Task 1.1: Google Cloud Setup & API Key                                                                                                          
    - Create Google Cloud project                                                                                                                   
    - Enable Sheets API v4                                                                                                                          
    - Generate API key with HTTP referrer restrictions                                                                                              
    - Store in .env file as VITE_GOOGLE_SHEETS_API_KEY                                                                                              
    - Test: Verify API key works with curl/Postman                                                                                                  
________________________________________                                                                                                           
Using Another LLM to Validate Claude’s Plan
From here, you’ll want to work with Claude to finalize the plan. When I’m working on architecture or a tricky problem, I’ll often ask another LLM to validate Claude’s Plan. In this case, I asked Gemini CLI to review Claude’s plan for any security issues. 

Tip: Copy and paste the Claude.md and rename it Gemini.md so Gemini has the same project context

Starting Gemini is as simple as starting up Claude


And this paid off! Google discovered a potential security flaw with Claude’s plan.


Adjusting the Plan and Fetching the Question Data
Based on Gemini’s feedback, we changed the approach slightly. Instead of directly calling the Sheets API from the app, the new plan was to:
Fetch and parse the data from a Share Link CSV
Once the revised plan was in place, I asked Claude to move forward:
Build Phase 1 MVP using CSV data integration, and create a test script to validate that the data is parsed correctly.
At this point, we finally moved from planning into implementation.
Debugging your First Issue
Right away, I hit a bug. Looking at the developer console in the browser, I could see I was getting a 307 Temporary Redirect. 

Pro Tip: When reporting a bug, share error information you see to CC to help it debug your issue faster. Since this is a web app, we can inspect the console and copy errors from the browser to Claude 



After debugging together, the fix was to create a new published CSV link directly from Google Sheets:
 https://docs.google.com/spreadsheets/d/e/2PACX-1vT8ZbiNbj00TARest-Srk4EwWuBTz6d7JDFE2B6kSW06GEECC9U42ksM3RyF9ssJ6Pl3pHoo--rPhLw/pub?gid=1423087399&single=true&output=csv

Once that was in place, the redirect issue disappeared and the integration worked as expected.
Why This Workflow Works
This sequence plan → validate → build → debug  is something you’ll repeat constantly when working with Claude Code.
The key takeaway isn’t the Google Sheets integration itself. It’s learning how to:
Plan before coding
Use Plan Mode for architecture
Validate ideas with a second LLM
Feed concrete error data back into Claude
That’s how you get consistent, high-quality results without feeling lost.
Version Control Basics 
Once you’ve validated the code works, it’s time to think about version control. 

Claude Code can write and modify files, but it’s not a source of truth for your project. If something goes wrong, you need a reliable way to get back to a known-good state. That’s where Git comes in. I use GitHub to track changes so I can always roll back to a known-good state.

Tip: after every meaningful feature or change, commit and push your code. This gives you a safety net and makes it much easier to recover if something breaks later.

Where /rewind Fits (and Where It Doesn’t)
Claude Code does have a command called /rewind, which lets you roll back changes within a session. It’s useful when Claude makes a change you don’t like and you want to undo recent edits without manually reverting files.

That said, /rewind is not a replacement for Git.

A helpful way to think about it:
/rewind → short-term, in-session undo
Git + GitHub → long-term version history and rollback

If you close a session, hit context limits, or want to return to something you built yesterday, /rewind won’t help you. Git will.

Github and Github CLI
If you haven’t used Git much before, the GitHub CLI is a nice way to simplify things:

https://cli.github.com/

Once you’ve created a repository on GitHub, you can ask Claude to help you set everything up locally and connect your project to that repo. This is a great example of using Claude for “glue work” that’s annoying to do manually.

Claude also created a .gitignore file for me, which tells Git which files should not be tracked like dependencies, build artifacts, and environment variables.

A Very Basic Git Workflow
If you’re not familiar with Git, here’s how a basic workflow for using Git looks like:

First, you tell Git which files you want to include in your next snapshot with the command “git add.” This is called staging your changes. 
Next, you save those staged changes into your local history: “git commit -m ‘Short Description’” 
Finally, you upload your commits to GitHub with “git push”

If you are working on a solo project, that’s usually enough. In team environments, you’d typically open a pull request, get feedback, and then merge.

Common Directory Structure
As the project grows, your folder structure will start to look more complex.

Claude set this up as a Node project, which typically looks something like this:
node_modules/ — all your dependencies live here
src/ — all your application code lives here

You don’t need to understand every folder. What matters is knowing where your code lives (src) and what should not be committed (node_modules, which is handled by .gitignore).

Screenshot of how mine looks like

Building the UI
CC could probably one shot all the UI, but I did it in stages. I asked Claude to break the UIwork into smaller, testable batches. The benefit of this is it’s easier to fix any bugs that come up. 

If something breaks, you know exactly which change caused it. It also keeps Claude focused on one thing at a time, which generally produces better results.

Screenshot of how my UI looks like


The Context Window, Memory Management, and Compact
At some point, you’ll run into Claude’s context window.

Right now, most people are working with a 200k token context window in Claude Code. Anthropic has been experimenting with much larger windows (up to 1M tokens) for some users, but availability is still limited.
Note:
The context window is the maximum amount of text Claude can read and reason over at once.
Tokens are roughly “word-like” units (not exactly words, but close enough for intuition).
There’s 2 key issues to keep in mind
First, as you approach the context limit, model performance can degrade. Claude Code shows a usage indicator in the bottom-right corner so you can see when you’re getting close.
Second, when you run out of context, Claude Code automatically runs compact. Compact attempts to summarize and retain only the most important information from the session. The problem is timing. If compact runs while Claude is actively modifying your code, the output quality can drop significantly. Some people have reported partially applied changes or inconsistent results when this happens mid-edit.

What to do?
What I do is, after completing a big feature or a batch of work, I ask Claude to “update the project memory” and then use the command /clear to start the conversation from the beginning.
People who utilize compact will simply run /compact before building a big feature

Tip: The command /context will show you where your tokens are being used


Hosting the Project
Once you’ve built the UI and you’re happy with how the site works locally, the final step is getting it online. Because this is a simple side project, I like to keep hosting simple too. I use Render for projects like this.
Render lets you:
Connect directly to your GitHub repository
Specify the build and start commands
Deploy your app in just a few minutes
You don’t need to think about servers, infrastructure, or deployment pipelines. You push to GitHub, Render pulls the latest code, and your site is live.
At this point, the project is “real.” You can share it, iterate on it, or just move on knowing you’ve shipped something end-to-end.
Wrapping Up and Key Takeaways
If you zoom out from all the tools, models, and setup steps, there are really just a few ideas that matter from this tutorial.
Everything else is implementation detail.
Key Takeaway #1: Planning Is the Real Force Multiplier
The biggest difference between a smooth experience with Claude Code and a frustrating one isn’t which tech stack you use, it’s whether you slow down and plan before you build.
Using Plan Mode, writing a lightweight product spec, breaking work into testable phases, and validating architecture before coding all dramatically reduce thrash. Claude is very good at generating code, but it’s much better when it’s operating inside a clear plan.
If you ever feel stuck or overwhelmed, that’s usually a signal to pause and re-plan, not to push harder.
Key Takeaway #2: Markdown Files Are the Real Unlock
If you look closely, almost everything that makes Claude Code feel “smart” over time comes down to markdown files.
Your product spec.
Your technical decisions. 
Your progress tracking.
Your Claude.md.
In a future article, when we use more advanced features like agents and slash commands, you’ll notice they’re also just markdown files with instructions. It powers all the reusable workflows within CC.
Once you internalize that, Claude Code will hopefully be less intimidating. 
Key Takeaway #3: Claude Code Is Always Changing
Commands change. Defaults change. New features appear sometimes without announcement. 
Claude Code will keep adding convenience features: better memory, better undo, better tooling. Those features are helpful, but they are helpers, not foundations. You don’t want your entire workflow to depend on any single command or default behavior staying the same.
That’s why the core practices in this tutorial matter:
Plan before building
Store durable context in markdown files
Commit frequently to Git
Treat Claude as a collaborator, not the system of record
How I Keep Up with Claude Code Changes
Because Claude Code is moving quickly, I don’t rely on any single tutorial (including this one) as a long-term source of truth. In practice, I keep up to date by:
Skimming discussions in subreddits like /ClaudeAI
Following Anthropic’s product and engineering updates
Occasionally checking the Claude Code changelog on GitHub 
And, most importantly, noticing changes as I use the product day to day
You don’t need to track everything closely. A light habit of staying curious is usually enough.
The Finished Project
If you want to see what the finished version looks like, the site we built in this tutorial is live here:
https://ai-pm-interview-prep.onrender.com/


