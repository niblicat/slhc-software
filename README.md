# Hearing Degredation Portal
Manage employee hearing data and communicate changes to employees!

## Requirements to run as is
- NPM
- Git CLI or GitHub Desktop
- Repository service (i.e. GitHub or GitLab) for [CI/CD](https://en.wikipedia.org/wiki/CI/CD)
- Vercel account using chosen repository service

## Setting up your project
!INTRO STUFF HERE!
This setup process is described using GitHub as your repository service
### Repository Setup
First, we will create a new repository from this one for your own version of the portal. With GitHub, we can [import a repository](https://docs.github.com/en/migrations/importing-source-code/using-github-importer/about-github-importer).

The URL for the source repository is `https://github.com/niblicat/slhc-software.git`. You should not require credentials to import it. Name it whatever you wish. Once you are done, copy your new repository's HTTPS web URL.
![Red box and arrow indication of where to find the HTTPS web URL on GitHub](readme-resources/readme_upstream_url.png)

In the command line/terminal, you should now clone your new repository using your new repository's link.
```git
git remote set-url origin {THE LINK YOU JUST COPIED}
```
### Vercel Setup
[Add a new Vercel project using your Git repository](https://vercel.com/docs/git).
Install Vercel CLI.
```
npm i -g vercel@37.4.2
```

## Running the project
Install the required packages
```
npm i
```

Use Vercel CLI (later versions may not work)
```
pnpm i -g vercel@37.4.2
```

Now run the project!
```
vercel dev
```