import React from "react";
import { Modal } from "antd";

export const trimVideoFFmpeg = async (
  ffmpeg,
  fileName,
  link,
  minTime,
  maxTime,
  fetchFile
) => {
  try {
    await ffmpeg.FS(
      "writeFile",
      `input_${fileName}.mp4`,
      await fetchFile(link)
    );
    await ffmpeg.run(
      "-i",
      `input_${fileName}.mp4`,
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-preset",
      "ultrafast",
      "-f",
      "mp4",
      `output_${fileName}.mp4`
    );
    const data = ffmpeg.FS("readFile", `output_${fileName}.mp4`);
    const downUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    return downUrl;
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

export const cropVideoFFmpeg = async (
  ffmpeg,
  fileName,
  link,
  cropDimensions,
  origDimensions,
  fetchFile
) => {
  let width = cropDimensions.width * origDimensions.width;
  let height = cropDimensions.height * origDimensions.height;
  let X = cropDimensions.x * origDimensions.width;
  let Y = cropDimensions.y * origDimensions.height;

  try {
    await ffmpeg.FS(
      "writeFile",
      `input_${fileName}.mp4`,
      await fetchFile(link)
    );

    await ffmpeg.run(
      "-i",
      `input_${fileName}.mp4`,
      "-filter:v",
      `crop=${width}:${height}:${X}:${Y}`,
      "-preset",
      "ultrafast",
      "-f",
      "mp4",
      `output_${fileName}.mp4`
    );
    const data = ffmpeg.FS("readFile", `output_${fileName}.mp4`);
    const downUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    return downUrl;
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

export const musicOverFFmpeg = async (
  ffmpeg,
  fileName,
  link,
  overMusic,
  fetchFile
) => {
  try {
    await ffmpeg.FS(
      "writeFile",
      `input_${fileName}.mp4`,
      await fetchFile(link)
    );
    await ffmpeg.FS(
      "writeFile",
      `input_music_${fileName}.mp3`,
      await fetchFile(overMusic)
    );

    await ffmpeg.run(
      "-i",
      `input_${fileName}.mp4`,
      "-i",
      `input_music_${fileName}.mp3`,
      "-filter_complex",
      "[0:a][1:a]amerge=inputs=2[a]",
      "-map",
      "[a]",
      "-map",
      "0:v",
      "-shortest",
      "-preset",
      "ultrafast",
      `output_${fileName}.mp4`
    );

    const data = ffmpeg.FS("readFile", `output_${fileName}.mp4`);
    const downUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    return downUrl;
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

export const getVideoDimensions = async (blobUrl) => {
  return new Promise((resolve, reject) => {
    const videoElem = document.createElement("video");

    videoElem.addEventListener(
      "loadedmetadata",
      function () {
        const width = this.videoWidth;
        const height = this.videoHeight;
        resolve({ width, height });
      },
      false
    );

    // Error handling
    videoElem.addEventListener(
      "error",
      function () {
        reject("An error occurred whilst trying to load the video");
      },
      false
    );
    videoElem.src = blobUrl;
    videoElem.load();
  });
};

export const extractImagesFFmpeg = async (
  ffmpeg,
  link,
  maxTime,
  fileName,
  fetchFile
) => {
  let imageLinks = [];
  try {
    await ffmpeg.FS(
      "writeFile",
      `input_${fileName}.mp4`,
      await fetchFile(link)
    );
    let timeIntervals, previews;
    // ffmpeg -i BBB.mp4 -filter_complex "fps=1/79" ou_%03d.png
    if (maxTime >= 8) {
      timeIntervals = 1 / Math.floor(maxTime / 8);
      previews = 8;
    } else {
      timeIntervals = 1;
      previews = parseInt(maxTime);
    }
    await ffmpeg.run(
      "-i",
      `input_${fileName}.mp4`,
      "-filter_complex",
      `fps=${timeIntervals}`,
      "-preset",
      "ultrafast",
      `${fileName}_%01d.png`
    );

    for (let i = 0; i < previews; i++) {
      let data = ffmpeg.FS("readFile", `${fileName}_${i + 1}.png`);
      let downUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/png" })
      );
      imageLinks.push(downUrl);
    }

    return imageLinks;
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

export const alertModal = (value) => {
  Modal.error({
    title: value,
  });
};

export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return !obj;
  else if (typeof obj === "string" || Array.isArray(obj))
    return obj.length === 0;
  else if (typeof obj === "object") return Object.keys(obj).length === 0;
  else return !obj;
};

export const sendDatatoForeGround = (value) => {
  let queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, value, function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log(response.status);
      }
    });
  });
};
