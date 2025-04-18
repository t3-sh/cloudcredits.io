import React, { type FC } from "react";
import type { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa6";
import * as GiIcons from "react-icons/gi";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";

type IconMap = Record<string, IconType>;

interface IDynamicIcon extends React.SVGProps<SVGSVGElement> {
  icon: string;
  className?: string;
}

const iconLibraries: { [key: string]: IconMap } = {
  fa: FaIcons,
  gi: GiIcons,
  bs: BsIcons,
  md: MdIcons,
};

const DynamicIcon: FC<IDynamicIcon> = ({ icon, ...props }) => {
  const IconLibrary = getIconLibrary(icon);
  const Icon = IconLibrary ? IconLibrary[icon] : undefined;

  if (!Icon) {
    return <span className="text-sm">Icon not found</span>;
  }

  return <Icon {...props} />;
};

const getIconLibrary = (icon: string): IconMap | undefined => {
  const libraryKey = icon.substring(0, 2).toLowerCase();

  return iconLibraries[libraryKey];
};

export default DynamicIcon;
