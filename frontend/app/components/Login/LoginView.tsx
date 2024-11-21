import * as THREE from "three";
import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PresentationControls, useGLTF, Float } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import GUI from "lil-gui";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { useThree } from "@react-three/fiber";

import wobbleVertexShader from "!raw-loader!../../../public/shaders/wobble/vertex.glsl";
import wobbleFragmentShader from "!raw-loader!../../../public/shaders/wobble/fragment.glsl";

import { FaDatabase } from "react-icons/fa";
import { FaDocker } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { GrConnect } from "react-icons/gr";
import { CgWebsite } from "react-icons/cg";
import { FaBackspace } from "react-icons/fa";
import { HiMiniSparkles } from "react-icons/hi2";
import { TbDatabaseEdit } from "react-icons/tb";

import { connectToVerba } from "@/app/api";

import VerbaButton from "../Navigation/VerbaButton";

import { Credentials, RAGConfig, Theme, Themes } from "@/app/types";

let prefix = "";
if (process.env.NODE_ENV === "production") {
  prefix = "/static";
} else {
  prefix = "";
}

const VerbaThree = ({
  color,
  useMaterial,
  model_path,
}: {
  color: string;
  useMaterial: boolean;
  model_path: string;
}) => {
  const verba_model = useGLTF(prefix + model_path);

  const material = useMemo(
    () =>
      new THREE.MeshMatcapMaterial({
        color: "#e6e6e6",
        matcap: new THREE.TextureLoader().load(prefix + "/ice_cap.png"), // Add this line
      }),
    []
  );

  const material1 = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        metalness: 0.4,
        roughness: 0.4,
        color: "#ffe229",
        ior: 1,
        thickness: 1,
        transparent: false,
        wireframe: false,
        clearcoat: 1,
        clearcoatRoughness: 0.0,
      }),
    []
  );

  useEffect(() => {
    const enableGUI = false; // Set this to true to re-enable the GUI

    if (enableGUI) {
      const gui = new GUI();
      const materialFolder = gui.addFolder("Material");

      materialFolder.add(material, "roughness", 0, 1).name("roughness");
      materialFolder.add(material, "metalness", 0, 1).name("metalness");
      materialFolder.add(material, "clearcoat", 0, 1).name("clearcoat");
      materialFolder
        .add(material, "clearcoatRoughness", 0, 1)
        .name("clearcoatRoughness");
      materialFolder.addColor(material, "color").name("color");
      return () => {
        gui.destroy();
      };
    }
  }, [material]);

  // Apply the shiny material to all meshes in the model
  useEffect(() => {
    verba_model.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log("Mesh:", child.name, "Material:", child.material);
        if (!useMaterial) {
          child.material = material;
        } else {
          child.material.roughness = 0.3;
          child.material.metalness = 0.2;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [verba_model, material]);

  return (
    <>
      <color args={[color]} attach="background" />
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float speed={2} rotationIntensity={1}>
          <primitive
            object={verba_model.scene}
            position-y={0}
            position-x={0}
            rotation-y={0.2}
            rotation-x={-0.2}
            position-z={0}
            scale={0.6}
          />
        </Float>
      </PresentationControls>
    </>
  );
};

interface LoginViewProps {
  credentials: Credentials;
  setCredentials: (c: Credentials) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setRAGConfig: (RAGConfig: RAGConfig | null) => void;
  setSelectedTheme: (theme: Theme) => void;
  setThemes: (themes: Themes) => void;
  production: "Local" | "Demo" | "Production";
}

const LoginView: React.FC<LoginViewProps> = ({
  setCredentials,
  setIsLoggedIn,
  setRAGConfig,
  setSelectedTheme,
  setThemes,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    setErrorText("");
    setIsConnecting(true);
    const response = await connectToVerba(email, password); // Call API with email/password
    if (response) {
      if (!("error" in response)) {
        setIsLoggedIn(false);
        setErrorText(JSON.stringify(response));
      } else if (response.connected == false) {
        setIsLoggedIn(false);
        setErrorText(
          response.error == "" ? "Couldn't connect to Weaviate" : response.error
        );
      } else {
        setIsLoggedIn(true);
        setCredentials(response.credentials);
        setRAGConfig(response.rag_config);
        if (response.themes) {
          setThemes(response.themes);
        }
        if (response.theme) {
          setSelectedTheme(response.theme);
        }
      }
    }
    setIsConnecting(false);
  };
  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="w-4/5 md:w-1/3">
        <h2 className="text-3xl font-light mb-4 text-center">Login to Ripple</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            connect();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Login"}
          </button>
        </form>
        {errorText && <p className="text-red-500 mt-4">{errorText}</p>}
      </div>
    </div>
  );
};

export default LoginView;
