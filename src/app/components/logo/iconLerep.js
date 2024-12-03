const IconLerep = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 117 42"
      {...props}
    >
      <defs>
        <pattern
          id="a"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <rect width="1" height="1" fill="blue" /> {/* Contoh isi */}
        </pattern>
        <pattern
          id="b"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <circle cx="0.5" cy="0.5" r="0.5" fill="red" /> {/* Contoh isi */}
        </pattern>
      </defs>
      <path fill="url(#a)" d="M63.587 3H0v36h63.587z" />
      <path
        fill="url(#b)"
        d="M96.228 0C84.756 0 75.457 9.402 75.457 21s9.3 21 20.771 21S117 32.598 117 21 107.7 0 96.228 0"
      />
    </svg>
  );
};

export default IconLerep;
