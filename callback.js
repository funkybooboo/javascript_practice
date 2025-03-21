console.log("Before");
getUser(1, readUser);
console.log("After");

function readUser(user) {
    console.log(`username: ${user.githubUsername}`);
    getRepositories(user.githubUsername, readRepos);
}

function readRepos(repos) {
    console.log(`repos: ${repos}`);
    for (let repo of repos)
        getCommits(repo, displayCommits)
}

function displayCommits(commits) {
    console.log(commits);
}

function getUser(id, callback) {
    setTimeout(() => {
        console.log("Reading a user from a database");
        const user = {id: id, githubUsername: "nate"};
        callback(user);
    }, 2000);
}

function getRepositories(username, callback) {
    setTimeout(() => {
        console.log("Reading from github");
        const repos = ["repo1", "repo2", "repo3"];
        callback(repos);
    }, 2000);
}

function getCommits(repo, callback) {
    setTimeout(() => {
        console.log("Reading a commits from a github");
        const commits = ["commit1", "commit2", "commit3"];
        callback(commits);
    }, 2000);
}

