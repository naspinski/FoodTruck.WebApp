import { Component } from 'react';
import * as React from 'react';
import { MenuCategory } from '../models/MenuCategory';
import { Category } from '../components/Category';

interface IProps {
    menuCategories: MenuCategory[]
}

interface IState {
    activePill: string
}

export class Menu extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            activePill: props.menuCategories.length > 0 ? props.menuCategories[0].sanitizedNamed : ''
        }
    }

    render() {
        const categories = this.props.menuCategories.map(x => new MenuCategory(x));

        return (
            <div id= 'menu' className='primary-color pb2'>
                <div className='inner-container'>
                    <h2>Menu</h2>
                    {categories.map(category => <Category category={category} key={'cat-' + category.id} />)}
                </div>
            </div>
        );
    }
}

//const nav = <div className='tc border-dotted bottom pb1'>
//    <div className='mha dib pb2'>
//        <MDBNav className="nav-pills">
//            {categories.filter(cat => !cat.excludeFromMenu && cat.name !== null && cat.name.length > 0).map(cat =>
//                <MDBNavItem key={`menu-category-${cat.sanitizedNamed}`}>
//                    <MDBNavLink
//                        className='mh1'
//                        to={`#menu-category-${cat.sanitizedNamed}`}
//                        active={this.state.activePill === cat.sanitizedNamed}>
//                        {cat.sanitizedNamed}
//                    </MDBNavLink>
//                </MDBNavItem>
//            )}
//        </MDBNav>
//    </div>
//</div>;

//togglePills = (pill: string) => {
//    this.setState({ activePill: pill });
//};