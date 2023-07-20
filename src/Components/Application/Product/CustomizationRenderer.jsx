import React from "react";
import CustomizationGroup from "./CustomizationGroup";
import Customization from "./Customization";

const CustomizationRenderer = (props) => {
  const { customizationGroups, setCustomizationGroups, customizations, setCustomizations } = props;

  const handleGroupChange = (updatedGroups) => {
    setCustomizationGroups(updatedGroups);
  };

  const handleCustomizationChange = (updatedCustomizations) => {
    setCustomizations(updatedCustomizations);
  };

  const renderCustomizations = (groups) => {
    const renderedElements = [];

    for (const group of groups) {
      if (group.seq === 1) {
        renderedElements.push(
          <React.Fragment key={group.id}>
            <CustomizationGroup
              group={group}
              customizationGroups={customizationGroups}
              handleGroupChange={handleGroupChange}
            />
            {renderCustomizationElements(group.id)}
          </React.Fragment>
        );
      }
    }

    return renderedElements;
  };

  const renderCustomizationElements = (groupId) => {
    const renderedElements = [];

    const groupCustomizations = customizations.filter((customization) => customization.parent === groupId);
    for (const customization of groupCustomizations) {
      renderedElements.push(
        <Customization
          //  styles={{ marginLeft: 20 }}
          customization={customization}
          customizations={customizations}
          handleCustomizationChange={handleCustomizationChange}
        />
      );

      if (customization.child) {
        const childGroup = customizationGroups.find((g) => g.id === customization.child);
        if (childGroup) {
          renderedElements.push(
            <React.Fragment key={childGroup.id}>
              <CustomizationGroup
                //  styles={{ marginLeft: 20 }}
                group={childGroup}
                customizationGroups={customizationGroups}
                handleGroupChange={(event) => handleGroupChange(event, childGroup.id)}
              />
              {renderCustomizationElements(childGroup.id)}
            </React.Fragment>
          );
        }
      }
    }

    return renderedElements;
  };

  return <div>{renderCustomizations(customizationGroups)}</div>;
};

export default CustomizationRenderer;
