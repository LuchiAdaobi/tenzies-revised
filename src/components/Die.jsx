export default function Die(props) {
  return (
    <section>
      <div
        className={`${props.isHeld ? "die-held" : "die"} ${
          props.notSameTenzies && props.value !== props.majorityValue
            ? "redBackground"
            : ""
        }`}
        onClick={props.holdDice}
      >
        {Array.from({ length: props.value }, (_, index) => (
          <div key={index} className="dot"></div>
        ))}
      </div>
    </section>
  );
}

