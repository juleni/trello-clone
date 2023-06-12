"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { Dialog, Transition } from "@headlessui/react";
import PhotoIcon from "@heroicons/react/24/solid/PhotoIcon";
import Image from "next/image";
import { Fragment, useRef } from "react";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";

/**
 * Boiler code copied from https://headlessui.com/react/dialog  ... Transition part
 */
function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const [image, setImage, newTaskInput, setNewTaskInput] = useBoardStore(
    (state) => [
      state.image,
      state.setImage,
      state.newTaskInput,
      state.setNewTaskInput,
    ]
  );
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" className="relative z-10" onClose={closeModal}>
        {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        {/*
          ...and another Transition.Child to apply a separate transition
          to the contents.
        */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>

                {/* Input field for Task/ToDo */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a task ..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>

                {/* Show radio group of Task Types */}
                <TaskTypeRadioGroup />

                <div>
                  {/* Upload image button */}
                  <button
                    type="button"
                    onClick={() => imagePickerRef.current?.click()}
                    className="w-full border border-gray-300 rounded-md outline-none p-5 
                    focus-visible: ring-2 focus-visible: ring-blue-500 focus-visible: ring-offset-2"
                  >
                    <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    Upload Image
                  </button>

                  {/* Image preview */}
                  {image && (
                    <Image
                      alt="Uploaded image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter hover: grayscale 
                        transition-all duration-150 cursor-not-allowed"
                      src={URL.createObjectURL(image)}
                      onClick={() => {
                        setImage(null);
                      }}
                    />
                  )}

                  {/* Upload image input reference*/}
                  <input
                    type="file"
                    hidden
                    ref={imagePickerRef}
                    onChange={(e) => {
                      // check e is an image
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                    placeholder="Enter a task ..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
