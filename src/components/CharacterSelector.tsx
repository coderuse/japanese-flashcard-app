import React, { useState, useMemo, useEffect } from "react";
import { Checkbox } from "antd";
import { allJapaneseCharacters } from "../data/characterData";
import { Character } from "../types";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

const CharacterSelector: React.FC<{
  onChange: (selected: string[]) => void;
}> = ({ onChange }) => {
  // Keep the existing data preparation code
  const { treeData, classToCharactersMap } = useMemo(() => {
    const typeToClassToChars = new Map<string, Map<string, Character[]>>();
    const charMap = new Map<string, string[]>();

    allJapaneseCharacters.forEach((char) => {
      if (!typeToClassToChars.has(char.type)) {
        typeToClassToChars.set(char.type, new Map());
      }

      const classKey =
        char.class || (char.jlptLevel ? `jlpt-${char.jlptLevel}` : "other");
      const mapKey = `${char.type}:${classKey}`;

      if (!typeToClassToChars.get(char.type)!.has(classKey)) {
        typeToClassToChars.get(char.type)!.set(classKey, []);
        charMap.set(mapKey, []);
      }

      typeToClassToChars.get(char.type)!.get(classKey)!.push(char);
      charMap.get(mapKey)!.push(char.id.toString());
    });

    // Prepare data for our custom tree
    const data: {
      title: string;
      key: string;
      children: { title: string; key: string; isLeaf?: boolean }[];
    }[] = [];
    typeToClassToChars.forEach((classToChars, type) => {
      const typeNode = {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        key: type,
        children: [] as { title: string; key: string; isLeaf?: boolean }[],
      };

      classToChars.forEach((chars, cls) => {
        const classNode = {
          title: `${
            cls.charAt(0).toUpperCase() + cls.slice(1).replace("-", " ")
          } (${chars.length} characters)`,
          key: `${type}:${cls}`,
          isLeaf: true,
        };
        typeNode.children.push(classNode);
      });
      data.push(typeNode);
    });

    return { treeData: data, classToCharactersMap: charMap };
  }, []);

  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // Initialize expanded keys
  useEffect(() => {
    // Don't expand any nodes by default (leave expandedKeys empty)
    // This will keep the tree collapsed to top nodes

    // Select the first top node and its children
    if (treeData.length > 0) {
      const firstNodeKey = treeData[0].key;
      const newCheckedKeys = new Set<string>();

      // Add the first top node
      newCheckedKeys.add(firstNodeKey);

      // Add all its children
      const firstNode = treeData[0];
      if (firstNode.children && firstNode.children.length > 0) {
        firstNode.children.forEach((child) => {
          newCheckedKeys.add(child.key);
        });
      }

      setCheckedKeys(newCheckedKeys);

      // Notify parent component of initial selection
      const selectedCharactersSet = new Set<string>();
      newCheckedKeys.forEach((k) => {
        if (classToCharactersMap.has(k)) {
          const charIds = classToCharactersMap.get(k);
          if (charIds) {
            charIds.forEach((charId) => selectedCharactersSet.add(charId));
          }
        }
      });

      onChange(Array.from(selectedCharactersSet));
    }
  }, [treeData]);

  const handleCheck = (key: string, checked: boolean) => {
    const newCheckedKeys = new Set(checkedKeys);

    // Helper function to recursively select/deselect children
    const updateChildrenCheckedState = (
      nodeKey: string,
      isChecked: boolean
    ) => {
      // Find the node by key
      const findNode = (nodes: any[], keyToFind: string): any => {
        for (const node of nodes) {
          if (node.key === keyToFind) {
            return node;
          }
          if (node.children && node.children.length > 0) {
            const foundInChildren = findNode(node.children, keyToFind);
            if (foundInChildren) return foundInChildren;
          }
        }
        return null;
      };

      const node = findNode(treeData, nodeKey);

      if (node && node.children && node.children.length > 0) {
        // Update all children
        node.children.forEach((child: any) => {
          if (isChecked) {
            newCheckedKeys.add(child.key);
          } else {
            newCheckedKeys.delete(child.key);
          }

          // Recursively update grandchildren
          if (child.children && child.children.length > 0) {
            updateChildrenCheckedState(child.key, isChecked);
          }
        });
      }
    };

    // Helper function to update parent checked state
    const updateParentCheckedState = () => {
      // Find parent by child key
      const findParentKey = (
        nodes: any[],
        childKey: string,
        parentKey: string | null = null
      ): string | null => {
        for (const node of nodes) {
          if (
            node.children &&
            node.children.some((child: any) => child.key === childKey)
          ) {
            return node.key;
          }
          if (node.children && node.children.length > 0) {
            const foundInChildren = findParentKey(
              node.children,
              childKey,
              node.key
            );
            if (foundInChildren) return foundInChildren;
          }
        }
        return parentKey;
      };

      // For each node in the tree
      const updateParent = (nodes: any[]) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            // Check if all children are checked
            const allChildrenChecked = node.children.every((child: any) =>
              newCheckedKeys.has(child.key)
            );

            if (allChildrenChecked) {
              newCheckedKeys.add(node.key);
            } else {
              newCheckedKeys.delete(node.key);
            }

            // Recursively update for nested children
            updateParent(node.children);
          }
        });
      };

      updateParent(treeData);
    };

    if (checked) {
      newCheckedKeys.add(key);
      updateChildrenCheckedState(key, true);
    } else {
      newCheckedKeys.delete(key);
      updateChildrenCheckedState(key, false);
    }

    // Update parent states based on children
    updateParentCheckedState();

    setCheckedKeys(newCheckedKeys);

    // Process selections for the parent component
    const selectedCharactersSet = new Set<string>();

    newCheckedKeys.forEach((k) => {
      if (classToCharactersMap.has(k)) {
        const charIds = classToCharactersMap.get(k);
        if (charIds) {
          charIds.forEach((charId) => selectedCharactersSet.add(charId));
        }
      }
    });

    onChange(Array.from(selectedCharactersSet));
  };

  const toggleExpand = (key: string) => {
    const newExpandedKeys = new Set(expandedKeys);
    if (newExpandedKeys.has(key)) {
      newExpandedKeys.delete(key);
    } else {
      newExpandedKeys.add(key);
    }
    setExpandedKeys(newExpandedKeys);
  };

  // Define the type for tree node structure
  interface TreeNodeData {
    key: string;
    title: string;
    children?: TreeNodeData[];
    isLeaf?: boolean;
  }

  // Custom TreeNode component
  const TreeNode: React.FC<{ node: TreeNodeData; level?: number }> = ({
    node,
    level = 0,
  }) => {
    const isExpanded = expandedKeys.has(node.key);
    const isChecked = checkedKeys.has(node.key);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div style={{ paddingLeft: `${level * 20}px` }}>
        <div style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
          {/* Arrow icon container */}
          <div
            onClick={hasChildren ? () => toggleExpand(node.key) : undefined}
            style={{
              cursor: hasChildren ? "pointer" : "default",
              width: "16px",
              height: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "8px",
              color: "#8c8c8c",
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <DownOutlined style={{ fontSize: "12px" }} />
              ) : (
                <RightOutlined style={{ fontSize: "12px" }} />
              )
            ) : (
              <span style={{ width: "12px" }} />
            )}
          </div>

          <Checkbox
            checked={isChecked}
            onChange={(e) => handleCheck(node.key, e.target.checked)}
          />

          <span style={{ marginLeft: "8px" }}>{node.title}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {(node.children || []).map((child) => (
              <TreeNode key={child.key} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          padding: "8px",
        }}
      >
        {treeData.map((node) => (
          <TreeNode key={node.key} node={node} />
        ))}
      </div>
    </div>
  );
};

export default CharacterSelector;
