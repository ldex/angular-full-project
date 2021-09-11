/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  compute(data);
  const response = `worker has finished.`;
  postMessage(response); // Send the response back to the component
});

function compute(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
      currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
