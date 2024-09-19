# Git Flow Integration Model

We will use **Git Flow** as our integration model. The key branches in this workflow are:

- **Main Branch**: Production-ready code.
- **Development Branch**: Integration branch for features and testing.

Feature branches should always be created from the `development` branch, and once complete, merged back into it. Testers should use the `development` branch to test before any changes are merged into the `main` branch.

## Cloning the Git Project

To clone the repository, use one of the following commands:

- Via HTTPS: `git clone https://gitlab.liu.se/tddc88-company-3-2024/security-surveillance-project.git`
- Via SSH: `git clone git@gitlab.liu.se:tddc88-company-3-2024/security-surveillance-project.git`

This will create a local copy of the remote repository.

## Basic Git Workflow

### See Current Branch

To check which branch you're on, use:

- `git branch`

The active branch will have a star `*` beside it.

### Create a Feature/Fix/Enhancement Branch

No one should push changes directly to `main`. Instead, create a new branch for each feature or fix you're working on:

- `git checkout -b your-feature-name`

This creates a new branch and switches to it.

### Implement Changes

Make your changes to the codebase as necessary.

### Stage Changes

After making changes, stage the files you modified:

- `git add file1 file2 …`
- or
- `git add .` (this adds all files in the folder)

Staging prepares your changes to be committed.

### Commit Changes

Commit the changes with a descriptive message:

- `git commit -m "Implemented feature X"`

Committing saves your changes to the local repository.

### Pull from Remote `development` Branch

Before pushing, it’s a good practice to ensure your feature branch is up to date with the latest `development` changes:

- `git pull origin development`

This pulls any new changes from `development` into your feature branch and helps resolve conflicts before merging.

### Push Changes

Once your feature branch is up to date and all changes are committed, push your branch to the remote repository:

- `git push origin your-feature-name`

### Merge Changes (Done on GitLab)

Once your feature branch is pushed:

1. Create a merge request (MR) from your feature branch to the `development` branch in GitLab.
2. Assign the lead developer (or the appropriate reviewer) to review the changes.
3. Ensure the option to **delete the source branch upon merge** is enabled.

This will initiate the review process and integrate your changes into `development`.

### Delete Your Working Branch Locally (After Merge)

After the merge request is approved and merged, delete your local feature branch:

- `git branch -d your-feature-name`

If the remote branch still exists (in case the option to delete it wasn't enabled during the merge), you can delete it manually:

- `git push origin --delete your-feature-name`

## Git Commands Cheat Sheet

| Command                             | Description                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `git status`                        | Check the current status of your working directory       |
| `git add <file>`                    | Stage changes for commit                                 |
| `git commit -m "message"`           | Commit changes with a message                            |
| `git pull origin <branch>`          | Pull the latest changes from the remote branch           |
| `git push origin <branch>`          | Push changes to the remote branch                        |
| `git checkout <branch>`             | Switch to an existing branch                             |
| `git checkout -b <branch-name>`     | Create a new branch and switch to it                     |
| `git rebase <branch>`               | Rebase the current branch on top of the specified branch |
| `git merge <branch>`                | Merge the specified branch into the current branch       |
| `git log`                           | View the commit history                                  |
| `git branch -d <branch-name>`       | Delete a local branch                                    |
| `git push origin --delete <branch>` | Delete a remote branch                                   |

---
