// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUser = document.querySelector('#ulUser');
const ulMsg = document.querySelector('#ulMsg');
const btnExit = document.querySelector('#btnExit');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/'
    : 'https://api-node-express-mongodb.herokuapp.com/api/auth/';

let user = null;
let socket = null;

// Validar el token de localstorage
const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {user: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;

    await connectSocket();
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-msg', printMessages);

    socket.on('active-users', printUsers);

    socket.on('msg-private', (msg) => {
        console.log(msg)
    });
}

const printUsers = (users = []) => {
    let userHTML = '';
    users.forEach(({name, uid}) => {
        userHTML += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });

    ulUser.innerHTML = userHTML;
}

const printMessages = (messages) => {
    let messagesHTML = '';
    console.log(messages)
    messages.forEach(({user, message}) => {
        messagesHTML += `
            <li>
                <p>
                    <span class="text-primary">${user.name}</span>
                    <span>${message}</span>
                </p>
            </li>
        `
    });

    ulMsg.innerHTML = messagesHTML;
}

txtMsg.addEventListener('keyup', ({keyCode}) => {
    const msg = txtMsg.value;
    const uid = txtUid.value;

    if (keyCode !== 13) return;
    if (msg.length === 0) return;

    socket.emit('send-msg', {msg, uid});
    txtMsg.value = '';
})

const main = async () => {
    await validateJWT();
}

main();

