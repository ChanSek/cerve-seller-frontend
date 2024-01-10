import React, { useState } from "react";
import cogoToast from "cogo-toast";
import { Button, Modal } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import { deleteCall, getCall, postCall } from "../../../Api/axios";
import AddCustomizationGroup from "../Product/AddCustomizationGroup";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import CustomDialog from "../../Shared/CustomDialog";

const _availableGroups = [
  {
    id: "G1",
    name: "Crust",
    optional: false,
    minQuantity: "1",
    maxQuantity: "1",
  },
  {
    id: "G2",
    name: "Size",
    optional: false,
    minQuantity: "1",
    maxQuantity: "1",
  },
  {
    id: "G3",
    name: "Toppings",
    optional: false,
    minQuantity: "1",
    maxQuantity: "1",
  },
];

const CustomizationGroups = () => {
  const theme = useTheme();
  const params = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [reordering, setReordering] = useState(false);

  const [availableGroups, setAvailableGroups] = useState(_availableGroups);
  const [customizationGroupData, setCustomizationGroupData] = useState({});

  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  const handleAdd = () => {};

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;

    setAvailableGroups((items) => {
      const reorderedItems = [...items];
      const movedItem = reorderedItems.splice(oldIndex, 1)[0];
      reorderedItems.splice(newIndex, 0, movedItem);
      return reorderedItems;
    });
  };

  const handleIgnoreDeleteAction = () => {
    setShowDeleteConfirmDialog(false);
    setGroupToDelete(null);
  };

  const handleRemoveGroup = (id) => {
    //  const url = `/api/v1/menu/${id}`;
    //  deleteCall(url).then(() => getAllMenu());
    handleIgnoreDeleteAction();
  };

  const Group = ({ data }) => {
    console.log("GROUP DATA: ", data);
    return (
      <div>
        <div
          style={{ borderStyle: reordering ? "dashed" : "solid" }}
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
                navigate(`/application/customizations/customization-groups/${data.name}/${data.id}`);
              }}
            >
              Edit group
            </Button>
            <Button
              disabled={reordering}
              variant="contained"
              sx={{ marginLeft: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirmDialog(true);
                setGroupToDelete(data._id);
              }}
            >
              Delete group
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const GroupItem = SortableElement(({ item }) => <Group data={item} />);

  const GroupList = SortableContainer(({ items }) => {
    return (
      <div>
        {items.map((item, index) => (
          <GroupItem key={`item-${index}`} index={index} item={item} />
        ))}
      </div>
    );
  });

  //   TODO:
  //   Edit page for customization groups
  //   Listing page for customization items
  //   Editing page for customization items

  return (
    <div className="container mx-auto my-8">
      <div className="mb-4">
        <BackNavigationButton
          onClick={() => {
            navigate(`/application/customizations`);
          }}
        />
      </div>
      <div className="mb-4 flex flex-row justify-between items-center">
        <label style={{ color: theme.palette.primary.main }} className="text-2xl font-semibold">
          Customization Groups
        </label>

        <div>
          <Button
            sx={{ marginRight: 1 }}
            variant="contained"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Customization Group
          </Button>
        </div>
      </div>

      <div>
        {reordering ? (
          <GroupList items={availableGroups} onSortEnd={onSortEnd} />
        ) : (
          <div>
            {availableGroups.length > 0 ? (
              availableGroups.sort((a, b) => a.seq - b.seq).map((item) => <Group data={item} key={item.id} />)
            ) : (
              <div>
                <div
                  className={`flex items-center justify-between py-4 px-4 mb-2 rounded-lg bg-white `}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p>No customization groups available.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddCustomizationGroup
        mode="add"
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        newCustomizationGroupData={customizationGroupData}
        setNewCustomizationGroupData={setCustomizationGroupData}
        customizationGroups={[]}
        handleAddCustomizationGroup={() => {}}
      />

      <CustomDialog
        showDialog={showDeleteConfirmDialog}
        onClose={handleIgnoreDeleteAction}
        onDiscard={handleIgnoreDeleteAction}
        onOk={() => handleRemoveGroup(groupToDelete)}
        title="Delete Menu?"
        message="Once deleted, it will be permanently deleted"
        discardButtonText="Cancel"
        okButtonText="Delete"
      />
    </div>
  );
};

export default CustomizationGroups;
