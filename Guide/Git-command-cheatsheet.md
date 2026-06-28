# Ultimate Git Commands Cheat Sheet

## 📋 Table of Contents
- [Ultimate Git Commands Cheat Sheet](#ultimate-git-commands-cheat-sheet)
  - [📋 Table of Contents](#-table-of-contents)
  - [Configuration](#configuration)
  - [Creating \& Cloning](#creating--cloning)
  - [Basic Workflow](#basic-workflow)
  - [Branching \& Merging](#branching--merging)
  - [Remote Repositories](#remote-repositories)
  - [History \& Inspection](#history--inspection)
  - [Diff \& Inspection](#diff--inspection)
  - [Undoing Changes](#undoing-changes)
  - [Stashing](#stashing)
  - [Advanced Commands](#advanced-commands)
  - [Pro Tips \& Aliases](#pro-tips--aliases)
    - [Useful Aliases](#useful-aliases)
    - [Common Workflows](#common-workflows)
    - [🤖 AI Workflow: Generating Commit Messages](#-ai-workflow-generating-commit-messages)
    - [🔥 Quick Reference Table](#-quick-reference-table)
  - [📚 Additional Resources](#-additional-resources)

---

## Configuration

```bash
# Set user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# View configuration
git config --list
git config --global --list

# Set default branch name
git config --global init.defaultBranch main

# Color output
git config --global color.ui auto

# Aliases (shortcuts)
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
```

[⬆ Back to Top](#-table-of-contents)

---

## Creating & Cloning

```bash
# Initialize a new repository
git init
git init -b main              # With specific branch name

# Clone a repository
git clone <repository-url>
git clone <repository-url> <folder-name>
git clone -b <branch-name> <repository-url>  # Clone specific branch
git clone --depth 1 <repository-url>         # Shallow clone (faster)
```

[⬆ Back to Top](#-table-of-contents)

---

## Basic Workflow

```bash
# Check status
git status
git status -s                 # Short format

# Add files to staging
git add <file>
git add .                     # Add all files
git add -A                    # Add all files (including deleted)
git add -p                    # Interactive patch selection

# Commit changes
git commit -m "Commit message"
git commit -am "Message"      # Add and commit tracked files
git commit --amend            # Modify last commit
git commit --amend -m "New message"
git commit --amend --no-edit  # Add staged changes to last commit
```

[⬆ Back to Top](#-table-of-contents)

---

## Branching & Merging

```bash
# List branches
git branch                    # Local branches
git branch -r                 # Remote branches
git branch -a                 # All branches

# Create branches
git branch <branch-name>
git checkout -b <branch-name> # Create and switch
git switch -c <branch-name>   # Newer alternative

# Switch branches
git checkout <branch-name>
git switch <branch-name>      # Newer alternative

# Delete branches
git branch -d <branch-name>   # Safe delete
git push origin --delete <branch-name> # remote branch
git branch -D <branch-name>   # Force delete

# Rename branch
git branch -m <new-name>
git branch -m <old-name> <new-name>

# Merge branches
git merge <branch-name>
git merge --no-ff <branch-name>  # No fast-forward
git merge --abort                # Abort merge conflict

# Rebase
git rebase <branch-name>
git rebase -i HEAD~n            # Interactive rebase last n commits
git rebase --continue
git rebase --abort

# Show merged/unmerged branches
git branch --merged
git branch --no-merged
```

[⬆ Back to Top](#-table-of-contents)

---

## Remote Repositories

```bash
# List remotes
git remote -v

# Add remote
git remote add <name> <url>
git remote add origin <url>

# Remove remote
git remote remove <name>

# Rename remote
git remote rename <old> <new>

# Fetch from remote
git fetch
git fetch <remote>
git fetch --all                # Fetch all remotes
git fetch --prune              # Fetch and remove stale refs

# Pull changes
git pull                       # Fetch + merge
git pull --rebase              # Fetch + rebase
git pull <remote> <branch>

# Push changes
git push
git push <remote> <branch>
git push -u origin <branch>    # Set upstream
git push --force               # Force push (caution!)
git push --force-with-lease    # Safer force push
git push --tags                # Push tags
git push --delete <remote> <branch>  # Delete remote branch
git push origin :<branch-name> # Alternative delete syntax

# Show remote information
git remote show <remote>

# Prune remote tracking branches
git remote prune origin

# Track a remote branch locally
git checkout -b <local-branch> <remote>/<remote-branch>
git checkout --track <remote>/<branch>  # Auto-create local branch

# Set upstream branch
git branch --set-upstream-to=<remote>/<branch>

# Show upstream branches
git branch -vv

# Sync fork with upstream
git remote add upstream <original-repo-url>
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

[⬆ Back to Top](#-table-of-contents)

---

## History & Inspection

```bash
# View commit history
git log
git log --oneline
git log --graph --oneline --all
git log --stat                # Show stats
git log -p                    # Show changes
git log -n 10                 # Limit to 10 commits
git log --since="2 weeks ago"
git log --grep="pattern"      # Search commit messages

# Show commits in a range
git log <branch1>..<branch2>
git log --left-right <branch1>...<branch2>

# View a specific commit
git show <commit-hash>
git show <tag>
git show HEAD~2

# Show who changed what
git blame <file>
git blame -L 10,20 <file>     # Lines 10-20

# Search for changes
git grep "pattern"
git grep -n "pattern"         # Show line numbers
```

[⬆ Back to Top](#-table-of-contents)

---

## Diff & Inspection

```bash
# View changes
git diff                      # Working directory vs staging
git diff --staged             # Staging vs last commit
git diff --cached             # Same as --staged
git diff <commit>             # Compare with specific commit
git diff <branch1> <branch2>

# View changes for specific file
git diff <file>
git diff --staged <file>

# Export diff to file (useful for AI commit messages)
git diff > diff.txt                      # Unstaged changes
git diff --cached > diff.txt             # Staged changes
git diff HEAD > diff.txt                 # All changes (staged + unstaged)
git diff <commit1> <commit2> > diff.txt  # Between two commits

# Compare commits
git diff HEAD~1 HEAD           # Last commit changes
git diff HEAD~2 HEAD           # Last 2 commits
git diff HEAD~3..HEAD          # Range of commits

# Show only names of changed files
git diff --name-only
git diff --name-status         # Show status (M/A/D)

# Show stats
git diff --stat
git diff --shortstat

# Show changes with context
git diff -U5                   # 5 lines of context
git diff --word-diff           # Word-level diff

# Ignore whitespace
git diff -w                    # Ignore whitespace changes
git diff --ignore-space-at-eol

# View changes in a specific commit
git show <commit-hash>
git show <commit-hash> --stat
git show <commit-hash> > commit-diff.txt  # Export to file

# View changes between branches
git diff main..feature         # Changes in feature not in main
git diff main...feature        # Changes in feature since branching from main
```

[⬆ Back to Top](#-table-of-contents)

---

## Undoing Changes

```bash
# Unstage files (keep changes)
git reset HEAD <file>
git restore --staged <file>   # Newer alternative

# Discard changes in working directory
git checkout -- <file>
git restore <file>            # Newer alternative
git restore .                 # All files

# Reset to previous commit
git reset --soft HEAD~1      # Keep changes staged
git reset --mixed HEAD~1     # Keep changes unstaged (default)
git reset --hard HEAD~1      # Discard all changes (DANGEROUS!)

# Undo commit and keep changes
git reset --soft HEAD^       # Undo last commit, keep changes

# Revert a commit (safe undo)
git revert <commit-hash>
git revert HEAD               # Revert last commit

# Clean untracked files
git clean -n                  # Dry run
git clean -f                  # Remove untracked files
git clean -fd                 # Also remove directories
```

[⬆ Back to Top](#-table-of-contents)

---

## Stashing

```bash
# Save changes
git stash
git stash save "message"
git stash push -m "message"

# List stashes
git stash list

# Apply stash
git stash apply               # Apply latest stash
git stash apply stash@{2}     # Apply specific stash

# Apply and drop
git stash pop                 # Apply latest and remove
git stash pop stash@{1}

# View stash content
git stash show
git stash show -p             # Show full diff

# Remove stash
git stash drop                # Remove latest
git stash drop stash@{1}
git stash clear               # Remove all

# Create branch from stash
git stash branch <branch-name>
```

[⬆ Back to Top](#-table-of-contents)

---

## Advanced Commands

```bash
# Tags
git tag                       # List tags
git tag <tag-name>           # Create lightweight tag
git tag -a <tag-name> -m "message"  # Annotated tag
git tag -d <tag-name>        # Delete tag
git push --tags               # Push all tags
git push origin <tag-name>

# Cherry-pick
git cherry-pick <commit-hash>
git cherry-pick <hash1> <hash2>
git cherry-pick --continue
git cherry-pick --abort

# Bisect (find bug)
git bisect start
git bisect good <commit>      # Mark as good
git bisect bad <commit>       # Mark as bad
git bisect reset              # End bisect

# Submodules
git submodule add <url> <path>
git submodule update --init --recursive
git submodule foreach git pull

# Worktrees
git worktree add <path> <branch>
git worktree list
git worktree remove <path>

# Reflog (recover lost commits)
git reflog
git reflog show <branch>
git checkout HEAD@{n}         # Restore from reflog

# Archive
git archive --format=zip --output=archive.zip HEAD
git archive --format=tar HEAD | gzip > archive.tar.gz

# Hooks (scripts in .git/hooks/)
# pre-commit, pre-push, post-merge, etc.
```

[⬆ Back to Top](#-table-of-contents)

---

## Pro Tips & Aliases

### Useful Aliases
Add these to your `.gitconfig`:

```bash
[alias]
    co = checkout
    br = branch
    st = status
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    tree = log --graph --oneline --all --decorate
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    undo = reset --soft HEAD^
    amend = commit --amend --no-edit
    wipe = !git add -A && git commit -m 'Wipe' && git reset --hard HEAD~
    
    # Diff exports for AI
    diff-export = !git diff > diff.txt
    diff-export-cached = !git diff --cached > diff.txt
    diff-export-all = !git diff HEAD > diff.txt
    
    # Copy diff to clipboard (macOS)
    diff-copy = !git diff | pbcopy
    diff-copy-cached = !git diff --cached | pbcopy
```

### Common Workflows

```bash
# Quick commit all changes
git add -A && git commit -m "Quick save"

# Update feature branch with main
git checkout feature
git rebase main
# or
git merge main

# Squash last 3 commits
git rebase -i HEAD~3  # Then change 'pick' to 'squash' for commits to squash

# Undo last push
git reset --hard HEAD~1
git push --force-with-lease

# Clean up local merged branches
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Generate diff for AI commit message
git diff > diff.txt
# Ask AI: "Write a commit message for these changes"
```

### 🤖 AI Workflow: Generating Commit Messages

```bash
# Step 1: Export diff
git diff --cached > diff.txt  # For staged changes
# or
git diff > diff.txt            # For unstaged changes

# Step 2: Ask AI
# "Here's the diff. Write a conventional commit message:"
# [paste diff.txt content]

# Step 3: Use the generated message
git commit -m "$(cat commit-message.txt)"
```

### 🔥 Quick Reference Table

| Task | Command |
|------|---------|
| Delete remote branch | `git push origin --delete <branch>` |
| View remote branches | `git remote -v` |
| Export diff for AI | `git diff > diff.txt` |
| Export staged diff | `git diff --cached > diff.txt` |
| View branch tracking | `git branch -vv` |
| Prune remote branches | `git remote prune origin` |
| Undo last commit (keep changes) | `git reset --soft HEAD^` |
| Discard all local changes | `git restore .` |
| Apply latest stash | `git stash pop` |
| View pretty log | `git log --graph --oneline --all` |

---

**Remember**: Always be careful with `--force` and `--hard` flags. They can permanently delete work!

## 📚 Additional Resources

- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

[⬆ Back to Top](#-table-of-contents)