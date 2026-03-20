# Tutorial on Git & GitHub 03
## Author: [Yuxiao (Rain) Luo](https://github.com/YuxiaoLuo)

---
## Creating a Syllabus File

The next step is to _initialize_ the project folder that we want Git to track. Even though we configured Git for our computer, Git doesn't start tracking every single file on our computer. That would turn into a headache quickly. We only want Git to track changes for files within specific folders/projects.  

When we initialize a folder, we are telling Git to pay attention to it. This only needs to happen once because what is actually happening through this process is Git is adding a hidden subfolder within your folder that houses the internal data structure required for version control. After initialization, Git is ready to track the files within the folder. The folder is now considered a Git _repository_.

First, use `cd`, navigate to the `git-practice` folder (inside `projects`). From your home directory, you can do all of them in one command by typing the following into your terminal:

```console
$ cd Desktop/projects/git-practice
```

Next we're going to _initialize_ our repository using the `git init` command, which should generate the following output:

```console
$ git init
Initialized empty Git repository in /home/<your-username>/projects/git/.git/
```

Now Git is tracking our directory. However, it has not done any versioning yet. This is because: 1> we haven't told Git to take a snapshot yet, and 2> there are no files in the folder to take a snapshot of. For now, Git knows this folder exists and is prepared to take a snapshot of the files when you tell it to.

Before version control is useful, we'll have to create a text file for Git to track. For this session, the file we will track will be a course syllabus—we'll create that next.

### Creating a Syllabus file

To create a plain text file, we're going to switch to our text editor, Visual Studio Code, to create and edit a file named `syllabus.md` and save it to our `git-practice` folder. The `.md` extension indicates that it is a Markdown file, which is a special file format we will dive into in the next section.  

If you have not installed Visual Studio Code, review [the installation instructions here](https://github.com/DHRI-Curriculum/install/blob/v2.0/guides/visual-studio-code.md).

In terminal, check to make sure you are in your `git-practice` folder. (_Hint_: use `pwd` to see what directory you are currently in.)

Next, open the `syllabus.md` file in Visual Studio Code using:

```console
$ code syllabus.md
```

You should see a window appear that looks similar to this:

![Image of what Visual Studio Code looks like when opening the syllabus.md file](data/image_tutorial/vscode1.png)

If Visual Studio Code does not open when you use the `code` command in your terminal, open it using the Start Menu on Windows or Spotlight Search on macOS as you would any other software. Then click `File > Open File` and use the dialog to navigate to the `/Users/<your-name>/Desktop/projects/git` folder and create a `syllabus.md` file there.

We'll be typing our markdown into this file in the Visual Studio Code window. At any time, you can save your file by hitting <kbd>control</kbd> + <kbd>s</kbd> on Windows or <kbd>⌘</kbd> + <kbd>s</kbd> on macOS. Alternatively, you can click the `File` menu on the top right, then select `Save` from the dropdown menu.

Saving frequently is advised. When we get to the version contol functionality of Git, only changes that are saved will be preserved when a version is created.

### Improve the Syllabus

Next, expand this syllabus by adding relevant content at your discretion. As a reference, you can draw inspiration from the existing INFS348 syllabus to guide structure, tone, and level of detail.

If you’re not familiar with Markdown (.md) formatting, don’t worry—simply follow this helpful guideline: https://markdownlivepreview.com/
. It provides an easy way to preview and understand how Markdown works as you write.

---

← [02-Setting Up Git](week13_GitHubTutorial_2.md)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[04-Staging and Committing Changes](week13_GitHubTutorial_4.md) →

##### Note: this tutorial is largely accommodated from a [CUNY GCDI workshop](https://github.com/DHRI-Curriculum/git/blob/v2.0/README.md). The author was a member of the organization.