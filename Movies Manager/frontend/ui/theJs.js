const xhttp = new XMLHttpRequest();
xhttp.open("GET", "http://localhost:3000/users");
xhttp.send();
xhttp.onload = function() {
    const obj = JSON.parse(this.responseText);
    for (var i=0; i<obj.length; i++) {
        var counter = obj[i];
        console.log("setting users")

        console.log(counter.user_name);
        setUserData(counter.user_name)
    }
}

function setUserData(name){
    var root = document.getElementById('profileplace');
    var user = document.createElement('li');
    var user_details = document.createElement('a')
    user_details.setAttribute('href','dashboard.html')
    var user_looks = document.createElement('img');
    user_looks.setAttribute('src','https://picsum.photos/200/300')
    var user_name = document.createElement('h2');
    user_name.innerHTML= name;


    user_details.appendChild(user_looks);
    user.appendChild(user_details)
    user.appendChild(user_name)
    root.appendChild(user); 

    user.addEventListener('click', function(event) { alert('clicked') });
}