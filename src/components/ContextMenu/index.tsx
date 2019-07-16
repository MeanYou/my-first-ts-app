import * as React from 'react';
import { ContextMenuProps } from './store';
import './style.less';

const ContextMenu = (props:ContextMenuProps) => {
    const { menuList } = props;
    const handleClick = (e:React.MouseEvent, cb:(id:string)=>void) => {
        e.preventDefault();
        e.stopPropagation();
        cb((e.target as HTMLDivElement).id);
    }
    return (
        <ul className="context-menu" style={{ display: props.show ? 'block' : 'none', left: props.left, top: props.top }}>
            {
                menuList.map(item => (
                    <li key={ item.title } onClick={ e => { handleClick(e, item.onClick); } }>{ item.title }</li>
                ))
            }
        </ul>
    );
}

export default ContextMenu;