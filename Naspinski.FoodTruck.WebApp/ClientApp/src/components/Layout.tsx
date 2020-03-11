import { Component } from 'react';
import * as React from 'react';
import { NavMenu } from './NavMenu';
import { SiteSettings } from '../models/SiteSettings';

interface IProps {
    settings: SiteSettings,
    menuCategoryCount: number,
    children: Object[]
}

export class Layout extends Component<IProps> {
    render () {
        return (
            <div>
                <NavMenu settings={this.props.settings} menuCategoryCount={this.props.menuCategoryCount} />
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
