# Tutorial on Git & GitHub 1
## Author: [Yuxiao (Rain) Luo](https://github.com/YuxiaoLuo)

## Learning Git Basics
If you're getting started with Git, a great place to learn the basic commands is the [Git Cheat sheet](https://training.github.com/downloads/github-git-cheat-sheet/). It's translated into many languages, open source as a part of the github/training-kit repository, and a great starting place for the fundamentals on the command line.

## Essential Git Commands

Some of the most important and commonly used Git commands include:

### Cloning a Repository
Clone (download) a repository that already exists on GitHub, including all files, branches, and commit history.
```bash
git clone [url]
```

### Checking Repository Status
```bash
git status
```
Displays the current branch, staged changes, unstaged changes, and other important information. A good habit is to run this often.

### Working with Branches
```bash
git branch
```
Lists all local branches.

```bash
git branch [branch-name]
```
Creates a new branch from your current location.

```bash
git branch --all
```
Shows all branches, including remote-tracking branches.

### Switching Branches
```bash
git checkout [branch-name]
```
Switches to the specified branch and updates your working directory.

### Staging Changes
```bash
git add [file]
```
Adds a file to the staging area, preparing it for the next commit.

### Committing Changes
```bash
git commit -m "descriptive message"
```
Records staged changes permanently in the repository history with a message.

### Updating from Remote
```bash
git pull
```
Fetches and merges updates from the remote repository into your current branch.

### Pushing to Remote
```bash
git push
```
Uploads your local commits to the remote repository.

### Viewing History
```bash
git log
```
Displays the commit history, allowing you to inspect project evolution.

### Viewing Remote Repositories
```bash
git remote -v
```
Lists remote repositories associated with your project along with their URLs (e.g., `origin`).

---

← [00-Review of Command Line](week13_GitHubTutorial_0.md)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[02-Setting Up Git](week13_GitHubTutorial_2.md) →