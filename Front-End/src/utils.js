/* eslint-disable import/prefer-default-export */

import { getCartItems } from "./localStorage";

/* Function to get the website location to know which screen to display */
export const parseRequestUrl = () => {
    const url = document.location.hash.toLowerCase();
    const request = url.split('/');
    return {
      resource: request[1],
      id: request[2],
      verb: request[3],
    };
  };

  /* Function to reload the page/screen once an item has been removed or added to the cart */
export const rerender = async (component) => {
  document.getElementById('main-container').innerHTML = await component.render();
  await component.after_render();
};

/* Loading Screen Functions */
export const showLoading = () => {
  document.getElementById('loading-overlay').classList.add('active');
};

export const hideLoading = () => {
  setTimeout(() => {
      document.getElementById('loading-overlay').classList.remove('active');
      }, 500);
};

/* Loading Message Functions */
export const showMessage = (message, callback) => {
  document.getElementById('message-overlay').innerHTML = `
    <div>
      <div id='message-overlay-content'>${message}</div>
      <button class='primary fw80' id='message-overlay-close-button'>Ok</button>
    </div>`;
  document.getElementById('message-overlay').classList.add('active');
  document.getElementById('message-overlay-close-button').addEventListener('click', () => {
    document.getElementById('message-overlay').classList.remove('active');
    if (callback) {
      callback();
    }
  });
};

export const redirectUser = () => {
  if (getCartItems().length !== 0) {
    document.location.hash = '/shipping';
  } else {
    document.location.hash = '/';
  }
};
