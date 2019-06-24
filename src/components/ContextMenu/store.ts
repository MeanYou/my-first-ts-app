export interface MenuItemProps {
    title: string,
    onClick: () => void
}

export interface ContextMenuProps {
    menuList: Array<MenuItemProps>,
    show: boolean,
    left: number,
    top: number
}