import React, { useState } from "react";
import { useMountedState } from "react-use";

import "@logseq/libs";
import {
  BlockEntity,
  BlockPageName,
  BlockUUID,
  ILSPluginUser,
  PageEntity,
} from "@logseq/libs/dist/LSPlugin";

export const useAppVisible = () => {
  const [visible, setVisible] = useState(logseq.isMainUIVisible);
  const isMounted = useMountedState();
  React.useEffect(() => {
    const eventName = "ui:visible:changed";
    const handler = async ({ visible }: any) => {
      if (isMounted()) {
        setVisible(visible);
      }
    };
    logseq.on(eventName, handler);
    return () => {
      logseq.off(eventName, handler);
    };
  }, []);
  return visible;
};

export const useSidebarVisible = () => {
  const [visible, setVisible] = useState(false);
  const isMounted = useMountedState();
  React.useEffect(() => {
    logseq.App.onSidebarVisibleChanged(({ visible }) => {
      if (isMounted()) {
        setVisible(visible);
      }
    });
  }, []);
  return visible;
};

//Source: https://github.com/vipzhicheng/logseq-plugin-vim-shortcuts/blob/master/src/common/funcs.ts
//FIXME null needed?
export async function createPageIfNotExists(pageName:string): Promise<PageEntity|null> {
  let page = await logseq.Editor.getPage(pageName);
  if (!page) {
    page = await logseq.Editor.createPage(
      pageName,
      {},
      {
        createFirstBlock: true,
        redirect: false,
      }
    );
  }
  // console.log("DB createPageIfNotExists", page)
  return page;
}

// export const getCurrentPage = async () => {
//   let page = await logseq.Editor.getCurrentPage();

//   if (!page) {
//     let blockUUID = await getCurrentBlockUUID();
//     if (blockUUID) {
//       let block = await logseq.Editor.getBlock(blockUUID);
//       if (block?.page.id) {
//         page = await logseq.Editor.getPage(block.page.id);
//       }
//     }
//   }

//   if (page?.name) {
//     tempCache.lastPage = page.name;
//   }
//   return page;
// };

export const getCurrentBlockUUID = async (): Promise<BlockUUID | undefined> => {
  let block = await logseq.Editor.getCurrentBlock();
  return block?.uuid;
};
