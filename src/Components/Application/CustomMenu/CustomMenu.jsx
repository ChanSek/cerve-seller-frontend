import React, { useEffect, useRef, useState } from "react";
import MenuBasicInfo from "./MenuBasicInfo";
import { Button, Modal } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import CustomDialog from "../../Shared/CustomDialog";
import { deleteCall, getCall, postCall } from "../../../Api/axios";
import { toast } from "react-toastify";
// dnd-kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

const availableMenu = [
  { id: "M1", seq: 1, name: "Snacks" },
  { id: "M2", seq: 2, name: "Breakfast" },
  { id: "M3", seq: 3, name: "Lunch" },
  { id: "M4", seq: 4, name: "Dinner" },
];

const CustomMenu = () => {
  const theme = useTheme();
  const params = useParams();
  const navigate = useNavigate();
  const initialAvailableMenu = useRef(availableMenu);

  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  const [reordering, setReordering] = useState(false);
  const [availableMenuItems, setAvailableMenuItems] = useState([]);

  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuData, setMenuData] = useState({
    seq: "",
    name: "",
    longDescription: "",
    shortDescription: "",
    images: [],
  });

  const [menuToDelete, setMenuToDelete] = useState(null);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const getAllMenu = async () => {
    const url = `/api/v1/menu?category=${encodeURIComponent(params.category)}`;
    //  const url = `/api/v1/menu?name=`;
    const res = await getCall(url);
    setAvailableMenuItems(res.data);
  };

  const handleAddMenu = async (data) => {
    let newMenuItem = { ...data };

    if (availableMenuItems.length === 0) newMenuItem["seq"] = 1;
    else newMenuItem["seq"] = availableMenuItems[availableMenuItems.length - 1].seq + 1;
    delete newMenuItem["uploaded_urls"];

    try {
      const url = `api/v1/menu/${params.category}`;
      const res = await postCall(url, newMenuItem);
      getAllMenu();
      setShowMenuModal(false);
      setMenuData({});
      toast.success("New menu created successfully");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleRemoveMenu = (id) => {
    const url = `/api/v1/menu/${id}`;
    deleteCall(url).then(() => getAllMenu());
    handleIgnoreDeleteAction();
  };

  const handleReordering = async () => {
    const updatedMenuItems = availableMenuItems.map((item, index) => ({
      ...item,
      seq: index + 1,
    }));
    setAvailableMenuItems(updatedMenuItems);

    const url = `/api/v1/menuOrdering`;
    try {
      const res = await postCall(url, updatedMenuItems);
      setReordering(false);
      toast.success("Menu order updated successfully");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const onDiscardChanges = () => {
    navigate(`/application/menu-category/`);
  };

  const onSaveChanges = () => {
    initialAvailableMenu.current = availableMenuItems;
    setShowDeleteConfirmDialog(false);
  };

  const detectChanges = () => {
    const hasChanges = availableMenuItems.some(
      (currentItem, index) =>
        currentItem.name !== initialAvailableMenu.current[index].name ||
        currentItem.seq !== initialAvailableMenu.current[index].seq
    );

    return hasChanges;
  };

  useEffect(() => {
    getAllMenu();
  }, [showMenuModal]);

  // dnd-kit sortable Menu
  function SortableMenu({ data, disabled }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: data.id,
      disabled
    });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      borderStyle: reordering ? "dashed" : "solid"
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          className={`flex items-center justify-between py-2 px-8 mb-2 border-2 border-[#1876d1a1] rounded-xl bg-white `}
          onClick={(e) => e.stopPropagation()}
        >
          <p>{data.name}</p>
          <div>
            <Button
              disabled={reordering}
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/application/menu-category/${params.category}/${data.name}/${data._id}`);
              }}
            >
              Edit Menu
            </Button>
            <Button
              disabled={reordering}
              variant="contained"
              sx={{ marginLeft: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirmDialog(true);
                setMenuToDelete(data._id);
                // handleRemoveMenu(data._id);
              }}
            >
              Delete Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // dnd-kit drag end handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = availableMenuItems.findIndex((item) => item.id === active.id);
      const newIndex = availableMenuItems.findIndex((item) => item.id === over?.id);
      setAvailableMenuItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleIgnoreDeleteAction = () => {
    setShowDeleteConfirmDialog(false);
    setMenuToDelete(null);
  };

  return (
    <div className="container mx-auto my-8">
      <div className="mb-4">
        <BackNavigationButton
          onClick={() => {
            navigate(`/application/menu-category/`);
          }}
        />
      </div>
      <div className="mb-4 flex flex-row justify-between items-center">
        <label style={{ color: theme.palette.primary.main }} className="text-2xl font-semibold">
          {params.category}: &nbsp;Custom Menu
        </label>

        <div>
          <Button
            sx={{ marginRight: 1 }}
            variant="contained"
            onClick={() => {
              setShowMenuModal(true);
            }}
            disabled={reordering}
          >
            Add Menu
          </Button>
          <Button
            sx={{ marginRight: 1, width: 200 }}
            variant="contained"
            onClick={() => {
              if (!reordering) {
                setReordering(true);
              } else {
                handleReordering();
              }
            }}
            disabled={availableMenuItems.length === 0}
          >
            {reordering ? "Finish" : "Change Sequence"}
          </Button>
        </div>
      </div>

      <div>
        {reordering ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={availableMenuItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {availableMenuItems.map((item) => (
                <SortableMenu key={item.id} data={item} disabled={!reordering} />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div>
            {availableMenuItems.length > 0 ? (
              availableMenuItems.sort((a, b) => a.seq - b.seq).map((item) => <SortableMenu key={item.id} data={item} disabled={true} />)
            ) : (
              <div>
                <div
                  className={`flex items-center justify-between py-4 px-4 mb-2 rounded-lg bg-white `}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p>No menus available.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddMenuModal
        showMenuModal={showMenuModal}
        handleCloseMenuModal={() => setShowMenuModal(false)}
        menuData={menuData}
        setMenuData={setMenuData}
        handleAdd={handleAddMenu}
      />

      <CustomDialog
        showDialog={showDeleteConfirmDialog}
        onClose={handleIgnoreDeleteAction}
        onDiscard={handleIgnoreDeleteAction}
        onOk={() => handleRemoveMenu(menuToDelete)}
        title="Delete Menu?"
        message="Once deleted, it will be permanently deleted"
        discardButtonText="Cancel"
        okButtonText="Delete"
      />
    </div>
  );
};

const AddMenuModal = (props) => {
  const { showMenuModal, handleCloseMenuModal, menuData, setMenuData, handleAdd } = props;

  const [errors, setErrors] = useState({});

  const validate = () => {
    let formErrors = {};
    formErrors.name = menuData?.name === "" ? "Menu Name is required" : "";
    formErrors.shortDescription = menuData?.shortDescription === "" ? "Short Description is required" : "";
    formErrors.longDescription = menuData?.longDescription === "" ? "Long Description is required" : "";
    formErrors.images = menuData?.images.length < 3 ? "Minimum 3 images are required" : "";
    setErrors({
      ...formErrors,
    });

    let valid_form = !Object.values(formErrors).some((val) => val !== "");

    return valid_form;
  };

  const handleClick = () => {
    if (validate()) {
      handleAdd(menuData);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        open={showMenuModal}
        onClose={() => {
          handleCloseMenuModal();
          setErrors({});
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "24px 40px",
            borderRadius: 20,
          }}
        >
          <p className="font-semibold text-xl" style={{ marginBottom: 10 }}>
            Add New Menu
          </p>

          <MenuBasicInfo menuData={menuData} setMenuData={setMenuData} errors={errors} />

          <div className="flex justify-end mt-4">
            <Button variant="contained" color="primary" onClick={handleClick}>
              Add
            </Button>
            <Button
              sx={{ marginLeft: 2 }}
              color="primary"
              onClick={(e) => {
                setMenuData({ seq: "", name: "", longDescription: "", shortDescription: "", images: [] });
                handleCloseMenuModal();
                setErrors({});
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CustomMenu;
