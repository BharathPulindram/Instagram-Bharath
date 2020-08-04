import React, { useEffect } from "react";
import "./App.css";
import Post from "./Components/Post";
import { useState } from "react";
import { db } from "./Components/Firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import { auth } from "./Components/Firebase";
import ImageUpload from "./Components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  console.log("user: ", user);
  console.log("username: ", username);

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user is logged in ....
        console.log(authUser);
        setUser(authUser);
      } else {
        //user is logged out ..
        setUser(null);
      }
    });
    return () => {
      //perform some clean up actions
      unSubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts") //use if u require for latest posts
      /* .orderBy("timestamp", "desc") */ .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              post: doc.data(),
            };
          })
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.freepnglogos.com/uploads/instagram-logos-png-images-free-download-2.png"
                alt="instagram logo"
              />
            </center>
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.freepnglogos.com/uploads/instagram-logos-png-images-free-download-2.png"
                alt="instagram logo"
              />
            </center>
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.freepnglogos.com/uploads/instagram-logos-png-images-free-download-2.png"
          alt="instagram logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                user={user}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            );
          })}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {/*  i want caption
    file picker
    post button */}
      {/* if user is undefined use optional ? */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry U need to Login!! to upload </h3>
      )}
    </div>
  );
}

export default App;
