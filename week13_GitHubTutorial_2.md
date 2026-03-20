# Tutorial on Git & GitHub 02
## Author: [Yuxiao (Rain) Luo](https://github.com/YuxiaoLuo)

---

## Setting Up Git

Through this section, you'll be checking your installation and configuring Git with your own name and information.

## Check Your Installation

First, let's make sure Git has been successfully installed. In your terminal, type the following command:

```console
$ git --version
```

If you see a version number, you're all set. If not, follow the installation instructions [here](https://github.com/DHRI-Curriculum/install/blob/v2.0/guides/git.md).

## Configuring Git on Your Computer

Our first step in working with Git is letting the software know who we are so it can track our work and attribute our contributions. This information is useful because it connects identifying information with the changes you make in your repository.

Type the following _two commands_ into your command line, replacing the "John Doe" and "johndoe@example.com" with your name and email (use quotations where you see them). These do not necessarily need to be the name and email you used to sign up for GitHub. Remember, these are different spaces and different softwares.

```console
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

To check your set-up, type the following command into your terminal:

```console
$ git config --list
```

You should get something that looks like this except with whatever information you entered previously:

```
user.name=Superstar Git User
user.email=gitsuperstar@gmail.com
```

## Evaluation

What are you doing when you set up git?
- You are creating a new version of the software on your local machine.
- You are sending files from your local machnine to GitHub?
- You are introducing yourself to the software, so it knows who you are.*
- You are creating a new version of a project folder on your local machine.

---

← [01-Learning Git Basics](week13_GitHubTutorial_1.md)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[03-Creating a Syllabus File](week13_GitHubTutorial_3.md) →

##### Note: this tutorial is largely accommodated from a [CUNY GCDI workshop](https://github.com/DHRI-Curriculum/git/blob/v2.0/README.md). The author was a member of the organization.