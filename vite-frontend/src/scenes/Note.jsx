import {
  createTLStore,
  getSnapshot,
  loadSnapshot,
  DefaultSpinner,
  Tldraw,
} from "tldraw";
import "tldraw/tldraw.css";
import { useState, useEffect, useRef } from "react";
import {
  saveImage,
  getSnapshotById,
  deleteImages,
  getNoteSnapshotData,
  saveSnapshot,
} from "../services/note-client";
import { useNavigate, useParams } from "react-router-dom";
import ModalLeavePage from "../components/note/ModalLeavePage";
import UseDetectEditorChanges from "../hooks/UseDetectEditorChanges";
import CustomMainMenu from "../TldrawConfig/CustomMainMenu";
import CustomShortCuts from "../TldrawConfig/CustomShortCuts";
import Sidebar from "./Sidebar";
import UseShowNoteToast from "../hooks/UseShowNoteToast";
import { toastStatus } from "../utils/toastStatus";
import useMediaQuery from "../hooks/useMediaQuery";

export default function Note() {
  const overrides = CustomShortCuts();

  const components = {
    DebugMenu: null,
    DebugPanel: null,
    MainMenu: CustomMainMenu,
  };
  const options = {
    maxPages: 1,
  };

  const { noteId } = useParams();
  const [snapshotId, setSnapshotId] = useState('');

  const changeDetectedRef = useRef(false);
  const [isSnapshotLoading, setIsSnapshotLoading] = useState(true);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [loadingState, setLoadingState] = useState({ status: "loading" });
  const [errorMessage, setErrorMessage] = useState();

  const sessionAssetsRef = useRef(new Set());
  const userAssetsRef = useRef(new Set());

  const editorRef = useRef();
  const [showNoteToast, setShowNoteToast] = useState(false);
  const [toastType, setToastType] = useState('');

  const [store] = useState(() => createTLStore({}));

  const [pageName, setPageName] = useState('');

  const isAboveSmallScreens = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    if (noteId) {
      getNoteSnapshotData(noteId)
        .then((res) => {
          setSnapshotId(res.data.snapshotId);
          if (res.data.snapshotId) {
            try {
              handleSnapshotLoading(res.data.snapshotId);
              userAssetsRef.current = new Set(res.data.assets);
              sessionAssetsRef.current = new Set(userAssetsRef.current);
              setIsSnapshotLoading(false);
            } catch (e) {
              setLoadingState("error");
              setErrorMessage(e.message);
            }
          } else {
            setIsSnapshotLoading(false);
          }
        })
        .catch(() => {
          navigate("/notes")
          setToastType(toastStatus.FAILED)
          setShowNoteToast(true);
        });
    }
  }, [noteId]);

  const handleSnapshotLoading = (snapshotId) => {
    getSnapshotById(snapshotId, noteId).then(res => {
      loadSnapshot(store, res.data)
    }).catch(() => {
      setToastType(toastStatus.FAILED)
      setShowNoteToast(true);
    });
  }

  async function fetchAssetFile(asset) {
    const response = await fetch(asset.props.src);
    const blob = await response.blob();
    return new File([blob], asset.id, { type: blob.type });
  }

  const handleImageSaving = async () => {
    const formData = new FormData();
    const assetsToUpdate = [];
    const imagesForDeletion = new Set();

    // Check for created images
    for (const imageId of sessionAssetsRef.current) {
      if (!userAssetsRef.current.has(imageId)) {
        const asset = editorRef.current.getAsset(imageId);

        if (asset) {
          const file = await fetchAssetFile(asset);
          const fileName = `${noteId}/${file.name}`;

          assetsToUpdate.push({
              id: asset.id,
              props: {
                ...asset.props,
                src: `${import.meta.env.VITE_API_BASE_URL}/assets/${fileName}`,
              },
            });
          formData.append("files", file);
        }

        userAssetsRef.current.add(imageId);
      }
    }

    // Check for deleted images
    for (const imageId of userAssetsRef.current) {
      if (!sessionAssetsRef.current.has(imageId)) {
        const asset = editorRef.current.getAsset(imageId);
        if (asset) {
          const fileName = `${imageId}`;
          imagesForDeletion.add(fileName);
          userAssetsRef.current.delete(imageId);
        }
      }
    }

    const assetsToDelete = editorRef.current.getAssets().filter(asset => !userAssetsRef.current.has(asset.id));
    if (assetsToDelete.length > 0) {
      editorRef.current.deleteAssets(assetsToDelete);
    }

    if (formData.has("files")) {
      formData.append("noteId", noteId);

      await saveImage(formData).then((res) => {
          if (assetsToUpdate.length > 0) {
            editorRef.current.updateAssets(assetsToUpdate);
          }
        }).catch(() => {
          setToastType(toastStatus.FAILED)
          setShowNoteToast(true);
        });
    }

    return {
      imagesForDeletion,
      userAssetsRef,
    };
  };

  // Save the snapshot to backend
  const handleSaveSnapshot = async () => {
    setLoadingState("loading");

    handleImageSaving().then((res) => {
      if (res.imagesForDeletion.size >= 1) {
        deleteImages([...res.imagesForDeletion], noteId).then((res) => {
          }).catch(() => {
            setToastType(toastStatus.FAILED)
            setShowNoteToast(true);
          });
      }

      const snapshot = getSnapshot(store);
      const jsonString = JSON.stringify(snapshot); 
      const snapshotFile = new Blob([jsonString], { type: 'application/json' });
      const formData = new FormData();
      
      formData.append('snapshotFile', snapshotFile);

      // Send snapshot to backend
      saveSnapshot(noteId, snapshotId, formData).then((res) => {
          setSnapshotId(res.data.snapshotId);
          changeDetectedRef.current = false;
          setIsOpen(false);
          setLoadingState("ready");
          setToastType(toastStatus.SUCCESS);
          setShowNoteToast(true);
        }).catch((e) => {
          setToastType(toastStatus.FAILED)
          setShowNoteToast(true);
          setLoadingState("error");
        });
    }).catch((err) => {
      setToastType(toastStatus.FAILED)
      setShowNoteToast(true);
    });
  };

  useEffect(() => {
    setLoadingState({ status: "ready" });
  }, [store]);

  if (loadingState.status === "loading") {
    return (
      <div className="tldraw__editor">
        <DefaultSpinner />
      </div>
    );
  }

  if (loadingState.status === "error") {
    return (
      <div className="tldraw__editor">
        <h2>Error!</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }

  const handleMoveToAnotherPage = (name) => {
    if (changeDetectedRef.current === true) {
      setPageName(name);
      setIsOpen(true);
    } else {
      navigate(`/${name}`);
    }
  };

  return (
    <section className="bg-zinc-800 z-10">
      {isOpen && (
        <ModalLeavePage
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          pageName={pageName}
          handleSaveSnapshot={handleSaveSnapshot}
        />
      )}
      <div className="relative flex w-full h-screen">
        {isAboveSmallScreens ? (
          <div className="w-20">
            <Sidebar isNoteSidebar={true} handleSaveNote={handleSaveSnapshot} handleLeaveNote={handleMoveToAnotherPage} />
          </div>
        ) : (
          <div>
            <Sidebar isNoteSidebar={true} handleSaveNote={handleSaveSnapshot} handleLeaveNote={handleMoveToAnotherPage} />
          </div>
        )}

        {/* WHITEBOARD */}
        <div className="flex-grow w-auto z-10">
          <Tldraw
            inferDarkMode
            acceptedImageMimeTypes={[
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/svg",
            ]}
            acceptedVideoMimeTypes={[]}
            maxAssetSize={5 * 1024 * 1024}
            components={components}
            options={options}
            store={store}
            overrides={overrides}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.sideEffects.registerAfterCreateHandler("asset", (asset) => {
                if (asset.type === "image") {
                  if (!sessionAssetsRef.current.has(asset.id))
                    sessionAssetsRef.current.add(asset.id);
                }
              });
              editor.sideEffects.registerAfterDeleteHandler("shape", (asset) => {
                if (asset.type === "image") {
                  sessionAssetsRef.current.delete(asset.props.assetId);
                }
              });
            }}
          >
            <UseShowNoteToast showToast={showNoteToast} setShowNoteToast={setShowNoteToast} type={toastType}/>
            <UseDetectEditorChanges
              changeDetectedRef={changeDetectedRef}
              isSnapshotLoading={isSnapshotLoading}
            />
          </Tldraw>

        </div>
      </div>
    </section>
  );
}
