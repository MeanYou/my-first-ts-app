import * as React from 'react';
import { ContextMenuProps } from './store';
import './style.less';

const ContextMenu = (props:ContextMenuProps) => {
    const { menuList } = props;
    const handleClick = (e:React.MouseEvent, cb:()=>{}) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(e, cb);
    }
    return (
        <ul className="context-menu" style={{ display: props.show ? 'block' : 'none', left: props.left, top: props.top }}>
            {
                menuList.map(item => (
                    <li onClick={ handleClick.bind(null, item.onClick) }>{ item.title }</li>
                ))
            }
        </ul>
    );
}

export default ContextMenu;