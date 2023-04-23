declare module "*.svg" {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}

//Aqui, estou dizendo que essa declaração irá aceitar
//todo tipo de arquivo svg e que ele irá receber componentes funcionais em svg.