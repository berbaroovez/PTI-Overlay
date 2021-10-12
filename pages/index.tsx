import React, { useEffect } from "react";

// import styled
import styled from "styled-components";
import { useTimer } from "react-timer-hook";
// import topicList from "./topics";

interface TopicProps {
  isFinished: boolean;
  isSelected?: boolean;
  admin?: boolean;
}

interface TopicType {
  topic: string;
  finished: boolean;
}

function App() {
  const [newTopic, setNewTopic] = React.useState("");
  const [topicList, setTopicList] = React.useState<TopicType[]>([]);
  const [timeResetValue, setTimeResetValue] = React.useState(120);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 120); // 10 minutes timer
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => console.warn("onExpire called"),
  });

  useEffect(() => {
    var retrievedObject = localStorage.getItem("Topics");

    if (retrievedObject !== null) {
      console.log("retrievedObject: ", JSON.parse(retrievedObject));
      setTopicList(JSON.parse(retrievedObject));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Topics", JSON.stringify(topicList));
  }, [topicList]);

  const finishTopTopic = () => {
    const tempTopicList = [...topicList];

    for (let i = 0; i < tempTopicList.length; i++) {
      if (tempTopicList[i].finished == false) {
        tempTopicList[i].finished = true;
        break;
      }
      setTopicList(tempTopicList);
    }
  };

  const finishTopic = (e: null, index: number) => {
    const tempTopicList = [...topicList];
    tempTopicList[index].finished = !tempTopicList[index].finished;
    setTopicList(tempTopicList);
  };

  //delete topic
  const deleteTopic = (e: null, index: number) => {
    const tempTopicList = [...topicList];
    tempTopicList.splice(index, 1);
    setTopicList(tempTopicList);
  };

  //add topic
  const addTopic = () => {
    const tempTopicList = [...topicList];
    tempTopicList.push({ topic: newTopic, finished: false });
    setTopicList(tempTopicList);
    setNewTopic("");
  };

  return (
    <>
      <TimerControls>
        <>
          <button className="start" onClick={start}>
            Start
          </button>
          <button onClick={pause}>Pause</button>
          {/* <button onClick={resume}>Resume</button> */}
          <button
            className="restart"
            onClick={() => {
              // Restarts to 5 minutes timer
              const time = new Date();
              time.setSeconds(time.getSeconds() + timeResetValue);
              restart(time);
              pause();
            }}
          >
            Restart
          </button>

          <button onClick={finishTopTopic}>Finish Top Topic</button>
        </>
        <>
          <label>Type in what time you want to reset to in seconds</label>
          <input
            type="number"
            value={timeResetValue}
            onChange={(e) => setTimeResetValue(parseInt(e.target.value))}
          />
        </>
      </TimerControls>

      <TopicControlZone>
        <>
          <h3>Add Topic +</h3>
          <input
            type="text"
            placeholder="Topic"
            value={newTopic}
            onChange={(e) => {
              setNewTopic(e.target.value);
            }}
          />
          <button onClick={addTopic}>Add</button>
        </>
        <TopicZone>
          {topicList.length > 0 &&
            topicList.map((topic, index) => (
              <Topic isFinished={topic.finished} key={Math.random()} admin>
                <TopicTitle>{topic.topic}</TopicTitle>
                <AdminButton>
                  <button
                    className="delete"
                    onClick={() => {
                      deleteTopic(null, index);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="finished"
                    onClick={() => {
                      finishTopic(null, index);
                    }}
                  >
                    Finished
                  </button>
                </AdminButton>
              </Topic>
            ))}
        </TopicZone>
      </TopicControlZone>
      <TickerZone>
        <TopicImage src="https://miro.medium.com/fit/c/1360/1360/1*GzNpk1PETIQT7umipMmaQw.jpeg" />
        <TimerZone>
          <Timer>
            <span>{minutes}</span>:{seconds < 10 && seconds > 0 && 0}
            <span>{seconds}</span>
            {seconds === 0 && <span>0</span>}
          </Timer>
        </TimerZone>
        <TopicZone>
          {topicList.length > 0 &&
            topicList.map((topic) => (
              <Topic isFinished={topic.finished} key={Math.random()}>
                <TopicTitle>{topic.topic}</TopicTitle>
              </Topic>
            ))}
        </TopicZone>
      </TickerZone>
    </>
  );
}
const TimerControls = styled.div`
  position: absolute;
  top: 100px;
  left: 500px;
  background-color: #afa2a2;
  padding: 10px 20px;
  border-radius: 10px;

  button {
    font-weight: bold;
    font-family: "Roboto", sans-serif;
    width: 100px;
    height: 50px;
    border-radius: 10px;
    border: none;
    background-color: #f5f5f5;

    &:hover {
      background-color: #e5e5e5;
    }
  }
  .start {
    background-color: #00b300;

    &:hover {
      background-color: #009900;
    }
  }

  .restart {
    background-color: #ff0000;

    &:hover {
      background-color: #cc0000;
    }
  }
`;

const TopicControlZone = styled.div`
  position: absolute;
  left: 500px;
  top: 300px;
`;
const TickerZone = styled.div`
  height: 100vh;
  width: 400px;
  /* background-color: blue; */
`;
const TopicImage = styled.img`
  width: 100%;
  height: 300px;
`;

const TimerZone = styled.div`
  position: relative;
  display: flex;
  margin-top: -10px;
  width: 100%;
  height: 70px;
  background: linear-gradient(269.79deg, #30332e -2.76%, #5a5c57 99.77%);
  border-color: hsl(96, 5%, 19%);
  border-style: solid;
  border-width: 4px;
  /* justify-content: flex-end; */
  /* align-items: flex-end; */
`;
const Timer = styled.div`
  position: absolute;
  bottom: -25px;
  /* background-color: #f5f5f5; */
  align-self: flex-end;
  font-size: 70px;

  color: white;
`;

const TopicZone = styled.div`
  background-color: hsl(6, 90%, 26%);
  width: 100%;
  height: 850px;
  padding-top: 2px; ;
`;
const Topic = styled.div<TopicProps>`
  position: relative;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: ${(p) =>
    p.isFinished == true ? "hsl(6, 70%, 26%)" : "hsl(6, 70%, 46%)"};
  color: ${(p) =>
    p.isFinished == true ? "hsl(0, 0%, 65.88235294117646%)" : "#ffffff"};
  width: ${(p) => (p.admin == true ? "500px" : "98%")};
  height: 70px;

  margin: 0 auto;
  margin-top: 4px;
  &:nth-of-type(1) {
    margin-top: 2px;
  }
`;

const TopicTitle = styled.div`
  padding-left: 10px;

  font-size: 30px;
  font-weight: bold;
  font-family: "Roboto", sans-serif;
`;

const AdminButton = styled.div`
  position: absolute;

  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;

  align-items: flex-end;
  .delete {
    background-color: #ff0000;
  }
  .finished {
    background-color: #23ff71;
  }
  button {
    padding: 5px;
    border-radius: 5px;
    border: none;
    font-weight: bold;
  }
`;
export default App;
