/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  sleep(data);
  const response = `worker has finished.`;
  postMessage(response);
});

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
      currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
