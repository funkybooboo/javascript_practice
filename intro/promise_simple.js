const promise = new Promise((resolve, reject) => {
    // Kick off some async work
    // resolve(1);
    // reject(new Error("message"));
    setTimeout(() => {
        reject(new Error("message"));
    }, 2000);
});

promise
    .then(result => {
        console.log("result", result);
    })
    .catch(error => {
        console.log("error", error);
    });
