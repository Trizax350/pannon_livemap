export interface Zone {
    id: number;
    desc: string;
    title: string;
    shape: Point[];
    active_from: string;
    active_to: string;
    layout_id: number;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    layer: number;
    start_z: number;
    end_z: number;
  }
  
  export interface Point {
    x: number;
    y: number;
    z: number;
  }
  