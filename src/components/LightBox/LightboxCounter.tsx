export type LightboxCounterProps = {
  title: string;
  currentIndex: number;
  total: number;
};

function LightboxCounter({
  title,

  currentIndex,

  total,
}: LightboxCounterProps) {
  return (
    <div
      className="
            text-center
            "
    >
      <h2
        className="
                text-white

                text-3xl

                font-semibold
                "
      >
        {title}
      </h2>

      <p
        className="
                mt-2

                text-neutral-400
                "
      >
        {currentIndex + 1}

        {" / "}

        {total}
      </p>
    </div>
  );
}

export default LightboxCounter;
