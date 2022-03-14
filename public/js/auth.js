var url = window.location.hostname.includes("localhost")
        ? "http://localhost:8080/api/auth/"
        : "https://restserver-node-dc.herokuapp.com/api/auth/";

const miForm = document.querySelector('form');

miForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miForm.elements) {
        if(el.name.length > 0)
            formData[el.name] = el.value;
    }

    fetch(url + 'login' , {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.log(err);
    });
});

function handleCredentialResponse(response) {
    //Google token: ID_TOKEN
    // console.log('id_token:', response.credential);
    const body = { id_token: response.credential };
    
    fetch(url + 'google' , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            localStorage.setItem("email", resp.usuario.correo);
            localStorage.setItem("token", resp.token);
            window.location = 'chat.html';
        })
        .catch((err) => console.warn(err));
}

const button = document.getElementById("google_signout");
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        localStorage.clear();
        location.reload();
    });
};
