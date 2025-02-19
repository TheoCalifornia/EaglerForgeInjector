//WIP worldedit by radmanplays

ModAPI.addEventListener("lib:libcustomitems:loaded", () => {
    console.log("Registered worldedit custom items.");
    LibCustomItems.registerItem({
        tag: "worldedit:wand",
        base: "wooden_axe",
        name: "Wand",
        qty: 1,
        recipe: [
            "   ",
            " # ",
            "   "
        ],
        recipeLegend: {
            "#": {
                "type": "item",
                "id": "wooden_axe"
            }
        },
        onRightClickGround: `/*/user, world, itemstack, blockpos/*/
        const prefix = "§7[§4worldedit§7] ";
        var username = ModAPI.util.str(user.getName());

        globalThis.pos2x = {}
        globalThis.pos2y = {}
        globalThis.pos2z = {}

        globalThis.pos2x[username] = blockpos.x
        globalThis.pos2y[username] = blockpos.y
        globalThis.pos2z[username] = blockpos.z
        console.log("rightclick: " + blockpos.x + ", " + blockpos.y + ", " + blockpos.z)
        // Send chat message to player
        user.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + "Pos #2 set to: " + blockpos.x + ", " + blockpos.y + ", " + blockpos.z)))
        return true;
        `,
        onLeftClickGround: `/*/user, world, itemstack, blockpos/*/
        const prefix = "§7[§4worldedit§7] ";
        var username = ModAPI.util.str(user.getName());

        globalThis.posx = {}
        globalThis.posy = {}
        globalThis.posz = {}

        globalThis.posx[username] = blockpos.x
        globalThis.posy[username] = blockpos.y
        globalThis.posz[username] = blockpos.z
        
        // Send chat message to player
        user.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + "Pos #1 set to: " + blockpos.x + ", " + blockpos.y + ", " + blockpos.z)))
        return true;
        `
    });
});

(() => {
    PluginAPI.dedicatedServer.appendCode(function () {
        PluginAPI.addEventListener("processcommand", (event) => {
            if (!ModAPI.reflect.getClassById("net.minecraft.entity.player.EntityPlayerMP").instanceOf(event.sender.getRef())) {return}
            const prefix = "§7[§4worldedit§7] ";
            if (event.command.toLowerCase().startsWith("//wand")) {
                // Create a new ItemStack for the custom item
                const ItemStackClass = ModAPI.reflect.getClassById("net.minecraft.item.ItemStack");
                const itemStack = ItemStackClass.constructors[4](
                    ModAPI.items["wooden_axe"].getRef(), 1
                );
                
                // Create NBT data for the item
                const NBTTagCompoundClass = ModAPI.reflect.getClassById("net.minecraft.nbt.NBTTagCompound");
                itemStack.$stackTagCompound = NBTTagCompoundClass.constructors[0]();
                const displayTag = NBTTagCompoundClass.constructors[0]();
                itemStack.$stackTagCompound.$setTag(ModAPI.util.str("display"), displayTag);

                // Set item name
                displayTag.$setString(ModAPI.util.str("Name"), ModAPI.util.str("Wand"));

                // Set item lore
                var loreList = ModAPI.reflect.getClassById("net.minecraft.nbt.NBTTagList").constructors[0]();
                loreList.$appendTag(ModAPI.reflect.getClassById("net.minecraft.nbt.NBTTagString").constructors.filter(x => { return x.length === 1 })[0](ModAPI.util.str("worldedit:wand")));
                displayTag.$setTag(ModAPI.util.str("Lore"), loreList);

                // Add the item to the sender's inventory
                const player = event.sender;
                player.inventory.addItemStackToInventory(itemStack);

                // Notify the sender
                const ChatComponentTextClass = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText");
                player.addChatMessage(ChatComponentTextClass.constructors[0](ModAPI.util.str(prefix + "A wand has been added to your inventory!")));
                player.addChatMessage(ChatComponentTextClass.constructors[0](ModAPI.util.str(prefix + "Left click: select pos #1; Right click: select pos #2")));
                
                event.preventDefault = true;
            }
            var blockPosConstructor = ModAPI.reflect.getClassById("net.minecraft.util.BlockPos").constructors.find((x) => { return x.length === 3 });
            if (event.command.toLowerCase().startsWith("//set")) {
                const args = event.command.substring("//set ".length);
                var username = ModAPI.util.str(event.sender.getName());
        
                if (args) {
                    const blockTypeName = args
                    const x1 = globalThis.posx[username], y1 = globalThis.posy[username], z1 = globalThis.posz[username];
                    const x2 = globalThis.pos2x[username], y2 = globalThis.pos2y[username], z2 = globalThis.pos2z[username];
        
                    // Validate block and get block type
                    const blockType = ModAPI.blocks[blockTypeName];
                    if (!blockType) {
                        event.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + `Invalid block: ${blockTypeName}`)));
                        event.preventDefault = true;
                        return;
                    }
                    const block = blockType.getDefaultState().getRef();
        
                    // Get min and max coordinates for the fill region
                    const xMin = Math.min(x1, x2), xMax = Math.max(x1, x2);
                    const yMin = Math.min(y1, y2), yMax = Math.max(y1, y2);
                    const zMin = Math.min(z1, z2), zMax = Math.max(z1, z2);
        
                    // Loop through the region and set the blocks
                    for (let x = xMin; x <= xMax; x++) {
                        for (let y = yMin; y <= yMax; y++) {
                            for (let z = zMin; z <= zMax; z++) {
                                const blockPos = blockPosConstructor(x, y, z);
                                event.sender.getServerForPlayer().setBlockState(blockPos, block, 3);
                            }
                        }
                    }
        
                    // Notify the player that the blocks have been set
                    event.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + `Set blocks to ${blockTypeName}`)));
                } else{
                    event.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + `Arguments not found!`)));
                }
                event.preventDefault = true;
        }
        if (event.command.toLowerCase().startsWith("//walls")) {
                const args = event.command.substring("//walls ".length);
                var username = ModAPI.util.str(event.sender.getName());

                if (args) {
                    const blockTypeName = args;
                    const x1 = globalThis.posx[username], y1 = globalThis.posy[username], z1 = globalThis.posz[username];
                    const x2 = globalThis.pos2x[username], y2 = globalThis.pos2y[username], z2 = globalThis.pos2z[username];

                    // Validate block and get block type
                    const blockType = ModAPI.blocks[blockTypeName];
                    if (!blockType) {
                        event.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + `Invalid block: ${blockTypeName}`)));
                        event.preventDefault = true;
                        return;
                    }
                    const block = blockType.getDefaultState().getRef();

                    // Get min and max coordinates for the region
                    const xMin = Math.min(x1, x2), xMax = Math.max(x1, x2);
                    const yMin = Math.min(y1, y2), yMax = Math.max(y1, y2);
                    const zMin = Math.min(z1, z2), zMax = Math.max(z1, z2);

                    // Loop through the region and set the walls (exclude interior blocks)
                    for (let x = xMin; x <= xMax; x++) {
                        for (let y = yMin; y <= yMax; y++) {
                            for (let z = zMin; z <= zMax; z++) {
                                if (x === xMin || x === xMax || z === zMin || z === zMax) {
                                    const blockPos = blockPosConstructor(x, y, z);
                                    event.sender.getServerForPlayer().setBlockState(blockPos, block, 3);
                                }
                            }
                        }
                    }

                    // Notify the player that the walls have been set
                    event.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + `Walls set to ${blockTypeName}`)));
                } else {
                    event.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str(prefix + `Arguments not found!`)));
                }
                event.preventDefault = true;
            }
        });
    });
})();
