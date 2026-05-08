"use client";

import { useEffect } from "react";

const tiTxt = "./rizzed";

export default function TitleAnimator() {
  useEffect(() => {
    document.title = "rizz..";

    let j = 0;
    let rvrs = false;
    let timer: ReturnType<typeof setTimeout>;

    function titleTtl() {
      if (!rvrs && j < tiTxt.length) {
        document.title = tiTxt.substring(0, j + 2);
        j++;
      } else if (rvrs && j >= 0) {
        document.title = tiTxt.substring(0, j + 2);
        j--;
      } else {
        rvrs = !rvrs;
        j = rvrs ? tiTxt.length - 2 : 0;
      }
      timer = setTimeout(titleTtl, 300);
    }

    const initial = setTimeout(titleTtl, 3000);
    return () => { clearTimeout(initial); clearTimeout(timer); };
  }, []);

  return null;
}