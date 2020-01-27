/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useContext, Fragment } from 'react'
import { AppContext } from './App'
import Tutorial from './Tutorial';
import { ErrorContext } from './shared/ErrorBoundary';
import ContentError from './ContentError';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Overview from './pages/Overview';
import Exporter from './pages/Exporter';
import Navigation from './shared/Navigation';
import CompareAgainst from './CompareAgainst';
import { mq } from './styling';
import Header from './shared/Header';
import Settings from './pages/Settings';

const Styles = css(mq({
  flexGrow: '1',
  flexShrink: '1',
  marginBottom: '3rem',
  marginLeft: [0, 450],

  '.editor-toggle': {
    display: ['block', 'none'],
    marginRight: '0.5rem',
    cursor: 'pointer',
  }
}));

export default function Content() {
  const [{ mons }] = useContext(AppContext);
  const [error] = useContext(ErrorContext);

  if (error) {
    return <ContentError />;
  }

  return (
    <div css={Styles}>
      <Header />

      <Router>
        {mons.length
          ? (
            <Fragment>
              <Navigation />

              <div css={{ padding: '1rem', paddingTop: '0' }}>
                <Switch>
                  <Route exact path="/tutorial" component={Tutorial} />
                  <Route exact path="/settings" component={Settings} />
                  <Route exact path="/export" component={Exporter} />
                  <Route exact path="/compare" component={CompareAgainst} />
                  <Route exact path="/" component={Overview} />
                </Switch>
              </div>

            </Fragment>
          ) : (
            <div css={{ padding: '1rem', paddingTop: '0' }}>
              <Route path="/" component={Tutorial} />
            </div>
          )
        }
      </Router>
    </div>
  )
}