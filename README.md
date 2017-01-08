# Natter
Natter is an IRC like chat application.
Natter is built using MEAN software stack.
In it's current implementation, the app works in the following manner :-
<ul>
    <li>Instead of a registration route/view, new users are registered when they login with a unique username and a password(of their choice). Thereafter, the user has to login with the same username-password combination.</li>
    <li>A user can view all users registered to Natter DB.</li>
    <li>Upon clicking on a user, one can start chatting with him/her. </li>
</ul>

# <h3>On the client side : </h3> 
The different states(ui-router states) are :- 
<ol>
    <li>userauth - Presents the authorization view.</li>
    <li>home - The home view.</li>
    <li>home.listusers - Lists all the users on the Natter app.</li>
    <li>home.listgroups - Lists the groups. This feature is yet to be built.</li>
    <li>home.natter - Presents the conversation view that allows chatting with another user.</li>
</ol>

# <h3>On the server side : </h3>
Although, listed in the package.json file, different modules used in the app are - 
<ol>
    <li>express - Well, it wouldn't be a MEAN app without express, would it? </li>
    <li>socketio - Create and handle sockets for bi-directional communication.</li>
    <li>mongoose - Mongoose provides a very easy api to work with mongodb via its schemas and models.</li>
    <li>express-session - Managing user sessions. Sessions are persisted in the database rather than saving them in cookies.</li>
    <li>connect-mongo - Used for storing sessions in DB.</li>
    <li>dotenv - exposes environment variables from the .env file.</li>
    <li>body-parser - Used to access form/json data sent by the client.</li>
    <li>crypto - Lastly, I have used the crypto module for password authentication.</li>
</ol>

# <h3>Different techniques that I learnt and implemented in Natter : </h3>
<ul>
    <li><b>Using socketio -</b> My first hands on with sockets in javascript. Much easier than sockets in c. Socketio provides a great API to exchange data to-and-forth between the client and server. </li>
    <li><b>Salt and hashing -</b> For a new user, the passwords are mixed with salt(random bytes) and hashed. Finally the password hash and the salt are stored in the database. On login , the passsword is again salt-and-hashed(salt used from the database). The password hash generated is matched against the one stored in the database to authenticate the user.</li>
    <li><b>Using the ui-router and ng-animate.</b></li>
</ul>

<p align="center"><img src="https://ourjourneytothewest.files.wordpress.com/2014/10/1024px-heart_corazc3b3n-svg.png?w=300&h=300" width="15px" height="15px"> JS.Happy coding.<b>|-_-|</b></p>
