import React, { useState } from "react";
import Button from "../../Shared/Button";
import { Add, Delete } from "@mui/icons-material";
import AddMenuProduct from "./AddMenuProduct";
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

const MenuProducts = (props) => {
  const { allProducts, addedProducts, setAddedProducts } = props;
  const [showModal, setShowModal] = useState(false);
  const [reordering, setReordering] = useState(false);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleRemoveProduct = (item) => {
    const filteredProducts = addedProducts.filter((p) => p.id !== item.id);
    setAddedProducts(filteredProducts);
  };

  // dnd-kit sortable Product
  function SortableProduct({ item, disabled }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: item.id,
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
          className="flex items-center justify-between py-[4px] px-8 mb-2 border border-[#1876d1a1] rounded-xl bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <p>{item.name}</p>
          <div onClick={() => handleRemoveProduct(item)}>
            <Button title="Remove" icon={<Delete />} disabled={reordering} />
          </div>
        </div>
      </div>
    );
  }

  // dnd-kit drag end handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = addedProducts.findIndex((item) => item.id === active.id);
      const newIndex = addedProducts.findIndex((item) => item.id === over?.id);
      setAddedProducts((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="container mx-auto my-8">
      <div className="mb-4 flex flex-row justify-between items-center">
        <div className="flex justify-end w-full">
          <div className="mr-2">
            <Button
              sx={{ width: 200 }}
              title={!reordering ? "Change Sequence" : "Finish"}
              variant="contained"
              onClick={() => setReordering((prevState) => !prevState)}
              disabled={addedProducts.length === 0}
            />
          </div>
          <div className="mr-2">
            <Button
              title="Add Products"
              variant="contained"
              icon={<Add />}
              disabled={reordering}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      </div>

      {reordering ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={addedProducts.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {addedProducts.map((item) => (
              <SortableProduct key={item.id} item={item} disabled={!reordering} />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div>
          {addedProducts.length > 0 ? (
            addedProducts.map((item) => <SortableProduct key={item.id} item={item} disabled={true} />)
          ) : (
            <div>
              <div className="flex items-center justify-between py-3 px-4 mb-2 border border-[#1876d1a1] rounded-lg bg-white">
                <p>No products are added in this menu.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <AddMenuProduct
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        addedProducts={addedProducts}
        allProducts={allProducts}
        setAddedProducts={setAddedProducts}
      />
    </div>
  );
};

export default MenuProducts;
