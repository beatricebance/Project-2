export interface GuideData {
    name: string;
    description: string;
    points: string;
    link: string;
}

export enum  GuideIndex {
    GUIDE_PENCIL_INDEX = 1,
    GUIDE_BRUSH_INDEX = 2,
    GUIDE_PIPETTE_INDEX = 3,
    GUIDE_COLOR_APPLICATOR_INDEX = 4,
    GUIDE_AIR_BRUSH_INDEX = 5,
    GUIDE_FEATHER_INDEX = 6,
    GUIDE_ERASER_INDEX = 7,
    GUIDE_BUCKET_INDEX = 8,
    GUIDE_LINE_INDEX = 9,
    GUIDE_RECTANGLE_INDEX = 10,
    GUIDE_ELLIPSE_INDEX = 11,
    GUIDE_POLYGONE_INDEX = 12,
    GUIDE_SELECTION_INDEX = 13,
    GUIDE_UNDO_REDO_INDEX = 14,
    GUIDE_GRID_INDEX = 15,
    GUIDE_NEW_INDEX = 16,
    GUIDE_SAVE_INDEX = 17,
    GUIDE_EXPORT_INDEX = 18,
    GUIDE_CONTINUE_INDEX = 19,
    GUIDE_GALERIE_INDEX = 20,
    GUIDE_SHORTCUT_INDEX = 21
}
