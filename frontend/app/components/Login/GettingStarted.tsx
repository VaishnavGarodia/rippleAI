"use client";

import React, { useEffect, useRef } from "react";
import VerbaButton from "../Navigation/VerbaButton";
import { FaGithub } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

interface GettingStartedComponentProps {
  addStatusMessage: (
    message: string,
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR"
  ) => void;
}

const GettingStartedComponent: React.FC<GettingStartedComponentProps> = ({
  addStatusMessage,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  return (
    <dialog id={"Getting-Started-Modal"} className="modal" ref={dialogRef}>
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="hero">
          <div className="hero-content flex-row">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl md:text-5xl font-bold">
                Welcome to Ripple
              </h1>
              <h2 className="text-lg md:text-2xl mt-2">
                Ripple
              </h2>
              <p className="py-6 text-sm md:text-base">
                Ripple allows you to search 
              </p>
              <p className="py-6 text-sm md:text-base">
                Learn more by visiting our website, ripple.ai. Schedule a demo to learn more,
                and please reach out to us if you have any questions.
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <VerbaButton
                  title="GitHub"
                  Icon={FaGithub}
                  onClick={() =>
                    window.open("https://github.com/weaviate/verba", "_blank")
                  }
                />
                <VerbaButton
                  title="YouTube"
                  Icon={FaYoutube}
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/watch?v=swKKRdLBhas",
                      "_blank"
                    )
                  }
                />
                <VerbaButton
                  title="Blog Post"
                  Icon={IoDocumentTextSharp}
                  onClick={() =>
                    window.open(
                      "https://weaviate.io/blog/verba-open-source-rag-app",
                      "_blank"
                    )
                  }
                />
              </div>
            </div>
            <div className="hidden md:block shrink-0">
              <img
                src="https://raw.githubusercontent.com/weaviate/Verba/main/img/thumbnail.png"
                alt="Verba AI"
                width={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
        <div className="modal-action mt-6 justify-center md:justify-end">
          <form method="dialog">
            <VerbaButton
              title="Let's get started"
              type="submit"
              selected={true}
              onClick={() => {
                addStatusMessage(
                  "Achievement unlocked: Welcome to Ripple!",
                  "SUCCESS"
                );
              }}
              selected_color="bg-primary-verba"
              Icon={FaHeart}
            />
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default GettingStartedComponent;
