

function signup(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/signup");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Signed up");
            window.location.href = "/login";
        } else if(xhr.status === 400){
            alert("Username already taken");
        }else{
            alert("Error signing up");
        }
    };
    xhr.send(JSON.stringify({ username, password }));
}

function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            window.location.href = "/";
        } else {
            alert("Error logging in");
        }
    };
    xhr.send(JSON.stringify({ username, password }));
}

function logout(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/logout");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Logged out");
            window.location.href = "/";
        } else {
            alert("Error logging out");
        }
    };
    xhr.send();
}

function upgradeAccount(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/user/upgrade");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Account upgraded");
            window.location.reload();
        } else {
            alert("Error upgrading account");
        }
    };
    xhr.send();
}

function downgradeAccount(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/user/downgrade");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Account downgraded");
            window.location.reload();
        } else {
            alert("Error downgrading account");
        }
    };
    xhr.send();
}

// function goToArtist(name) {
//     console.log(name);

//     let xhr = new XMLHttpRequest();
//     xhr.open("GET", "/user/checkIfArtistExists");
//     xhr.setRequestHeader("Content-Type", "application/json");

//     xhr.onload = function () {
//         console.log(xhr.status);
//         console.log(xhr.responseText);

//         if (xhr.status === 200) {
//             window.location.href = "/user/" + name;
//         } else {
//             alert("Error going to artist");
//         }
//     };

//     xhr.send();
// }

function goToArtist(name) {
    if(name == "undefined"){
        alert("Artist does not exist");
    }else{
        window.location.href = "/user/" + name;
    }
}

function follow(artist){
    let artistUsername = JSON.parse(artist).username;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/user/follow");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Followed");
            window.location.href = "/user/" + artistUsername;
        } else {
            alert("Error following");
        }
    };
    xhr.send(artist);
}

function unfollow(artist){
    let artistUsername = JSON.parse(artist).username;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/user/unfollow");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Unfollowed");
            window.location.href = "/user/" + artistUsername;
        } else {
            alert("Error unfollowing");
        }
    };
    xhr.send(artist);
}

function checkFollowers(artist, user){
    console.log(artist);
    console.log(user);
    if(artist.followers.includes(user._id)){
        return true;
    }else{
        return false;
    }
}


function like(artworkId){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/gallery/like");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Liked");
            window.location.reload();
        } else {
            alert("Error liking");
        }
    };
    xhr.send(JSON.stringify({ artworkId })); // Send as JSON string
}

function unlike(artworkId){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/gallery/unlike");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Unliked");
            window.location.reload();
        } else {
            alert("Error unliking");
        }
    };
    xhr.send(JSON.stringify({ artworkId })); // Send as JSON string
}

function addReview(artworkId) {
    try {
        let review = document.getElementById(artworkId).value;

        if (!review) {
            console.error("Review is empty");
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/gallery/review");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            console.log(xhr.status);
            console.log(xhr.responseText);

            if (xhr.status === 200) {
                alert("Review added");
                window.location.reload();
            } else {
                alert("Error adding review");
            }
        };

        xhr.send(JSON.stringify({ review, artworkId }));
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

function deleteReview(artworkId, review) {
    try {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/gallery/deleteReview");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            console.log(xhr.status);
            console.log(xhr.responseText);

            if (xhr.status === 200) {
                alert("Review deleted");
                window.location.reload();
            } else {
                alert("Error deleting review");
            }
        };

        xhr.send(JSON.stringify({ artworkId, review }));
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

function goToArtwork(artworkId) {
    if(artworkId == "undefined"){
        alert("Artwork does not exist");
    }else{
        window.location.href = "/art/" + artworkId;
    }
}


function createWorkshop(){
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/workshop/createWorkshop");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            alert("Workshop created");
            window.location.href = `/workshop/${response.workshopId}`;
        } else {
            alert("Error creating workshop");
        }
    };
    xhr.send(JSON.stringify({ title, description}));
}

function joinWorkshop(workshopId){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/workshop/joinWorkshop");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Joined workshop");
            window.location.href = `/workshop/${workshopId}`;
        } else {
            alert("Error joining workshop");
        }
    };
    xhr.send(JSON.stringify({ workshopId }));
}

function leaveWorkshop(workshopId){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/workshop/leaveWorkshop");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Left workshop");
            window.location.href = `/workshop/${workshopId}`;
        } else {
            alert("Error leaving workshop");
        }
    };
    xhr.send(JSON.stringify({ workshopId }));
}