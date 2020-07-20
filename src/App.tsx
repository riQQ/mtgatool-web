/* eslint-disable react/prop-types */
import React, { useCallback } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader/root";

import TopNav from "./components/topnav";
import Footer from "./components/footer";

// Pages
import Home from "./components/home";
import NotFound from "./components/notfound";
import ReleaseNotes from "./components/release-notes";
import Metagame from "./components/metagame";
import Register from "./components/register";
import ResetPassword from "./components/resetpassword";
import Docs from "./components/docs";
import DeckView from "./components/deck-view";
import ActionLog from "./components/action-log";
import DraftView from "./components/draft-view";
import Database from "./components/database";

import CardHover from "./components/card-hover";
import Loading from "./components/loading";
import CookiesSign from "./components/cookies";

import { WrapperOuter } from "./components/wrapper";

// Import once so all CSS can use it thanks to webpack magic
import css from "./app.css";
import keyArt from "./images/key-art.jpg";
import notFoundArt from "./images/404.jpg";
import { DbCardData } from "./types/Metadata";
import { reduxAction } from "./redux/webRedux";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./redux/stores/webStore";

function App(): JSX.Element {
  const [artData, setArtData] = React.useState("Bedevil by Seb Mckinnon");
  const [imageUrl, setImageUrl] = React.useState(keyArt);
  const position = React.useRef(window);
  const webContext = useSelector((state: AppState) => state.web);

  const dispatch = useDispatch();
  const setScroll = useCallback(
    (scroll: number): void => {
      reduxAction(dispatch, { type: "SET_SCROLL", arg: scroll });
    },
    [dispatch]
  );

  const handleScroll = useCallback((): void => {
    //console.log("handleScroll", window.scrollY);
    setScroll(window.scrollY);
  }, [setScroll]);

  React.useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return (): void => window.removeEventListener("scroll", handleScroll);
  }, [position, handleScroll]);

  const setImage = (cardObj: DbCardData | string): void => {
    if (cardObj == keyArt) {
      setImageUrl(keyArt);
      setArtData("Bedevil by Seb Mckinnon");
    } else if (cardObj == notFoundArt) {
      setImageUrl(notFoundArt);
      setArtData("Totally Lost by David Palumbo");
    } else if (cardObj && typeof cardObj !== "string") {
      setImageUrl("https://img.scryfall.com/cards" + cardObj.images.art_crop);
      setArtData(cardObj.name + " by " + cardObj.artist);
    }
  };

  const wrapperStyle = {
    backgroundImage: `url("${imageUrl}")`
  };

  return (
    <>
      <Database />
      <Loading />
      <CookiesSign />
      <Router>
        <div style={wrapperStyle} className={css.wrapperImage} />
        <TopNav artist={artData} />
        <CardHover />
        {webContext.databaseVersion !== 0 ? (
          <Switch>
            <Route exact path="/">
              <Home setImage={setImage} />
            </Route>
            <Route path="/metagame">
              <Metagame setImage={setImage} />
            </Route>
            <Route exact path="/register">
              <Register setImage={setImage} />
            </Route>
            <Route path="/resetpassword">
              <ResetPassword setImage={setImage} />
            </Route>
            <Route exact path="/release-notes">
              <ReleaseNotes setImage={setImage} />
            </Route>
            <Route path="/deck">
              <DeckView setImage={setImage} />
            </Route>
            <Route path="/action-log">
              <ActionLog setImage={setImage} />
            </Route>
            <Route path="/draft">
              <DraftView setImage={setImage} />
            </Route>
            <Route path="/docs">
              <Docs setImage={setImage} />
            </Route>
            <Route>
              <NotFound setImage={setImage} />
            </Route>
          </Switch>
        ) : (
          <WrapperOuter>
            <div className={css.loading}>Loading..</div>
          </WrapperOuter>
        )}
        <Footer />
      </Router>
    </>
  );
}

export default hot(App);
