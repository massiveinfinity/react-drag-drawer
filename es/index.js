var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _class, _temp2;

var _templateObject = _taggedTemplateLiteralLoose(
    [
      "\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n\n  display: flex;\n  justify-content: center;\n  flex-shrink: 0;\n  align-items: center;\n\n  z-index: 11;\n  transition: background-color 0.2s linear;\n\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n"
    ],
    [
      "\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n\n  display: flex;\n  justify-content: center;\n  flex-shrink: 0;\n  align-items: center;\n\n  z-index: 11;\n  transition: background-color 0.2s linear;\n\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n"
    ]
  ),
  _templateObject2 = _taggedTemplateLiteralLoose(
    ["\n  position: absolute;\n  top: 0;\n  height: 1px;\n  width: 100%;\n"],
    ["\n  position: absolute;\n  top: 0;\n  height: 1px;\n  width: 100%;\n"]
  );

function _taggedTemplateLiteralLoose(strings, raw) {
  strings.raw = raw;
  return strings;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

import React, { Component } from "react";
import { Motion, spring, presets } from "react-motion";
import PropTypes from "prop-types";
import document from "global/document";
import Observer from "react-intersection-observer";
import { css } from "emotion";
import { createPortal } from "react-dom";

import {
  isDirectionBottom,
  isDirectionTop,
  isDirectionLeft,
  isDirectionRight,
  isClientSide
} from "./helpers";

if (isClientSide()) {
  require("intersection-observer");
}

var Drawer = ((_temp2 = _class = (function(_Component) {
  _inherits(Drawer, _Component);

  function Drawer() {
    var _temp, _this, _ret;

    _classCallCheck(this, Drawer);

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        _Component.call.apply(_Component, [this].concat(args))
      )),
      _this)),
      (_this.state = {
        open: _this.props.open,
        thumb: 0,
        start: 0,
        position: 0,
        touching: false,
        listenersAttached: false
      }),
      (_this.MAX_NEGATIVE_SCROLL = 20),
      (_this.SCROLL_TO_CLOSE = 75),
      (_this.ALLOW_DRAWER_TRANSFORM = true),
      (_this.attachListeners = function(drawer) {
        var _this$props = _this.props,
          dontApplyListeners = _this$props.dontApplyListeners,
          getModalRef = _this$props.getModalRef,
          direction = _this$props.direction;
        var listenersAttached = _this.state.listenersAttached;

        // only attach listeners once as this function gets called every re-render

        if (!drawer || listenersAttached || dontApplyListeners) return;

        _this.drawer = drawer;
        getModalRef(drawer);

        _this.drawer.addEventListener("touchend", _this.release);
        _this.drawer.addEventListener("touchmove", _this.drag);
        _this.drawer.addEventListener("touchstart", _this.tap);

        var position = 0;

        if (isDirectionRight(direction)) {
          position = drawer.scrollWidth;
        }

        _this.setState(
          { listenersAttached: true, position: position },
          function() {
            setTimeout(function() {
              // trigger reflow so webkit browsers calculate height properly 😔
              // https://bugs.webkit.org/show_bug.cgi?id=184905
              _this.drawer.style.display = "none";
              void _this.drawer.offsetHeight;
              _this.drawer.style.display = "";
            }, 300);
          }
        );
      }),
      (_this.removeListeners = function() {
        if (!_this.drawer) return;

        _this.drawer.removeEventListener("touchend", _this.release);
        _this.drawer.removeEventListener("touchmove", _this.drag);
        _this.drawer.removeEventListener("touchstart", _this.tap);

        _this.setState({ listenersAttached: false });
      }),
      (_this.tap = function(event) {
        var _event$touches$ = event.touches[0],
          pageY = _event$touches$.pageY,
          pageX = _event$touches$.pageX;

        var start =
          isDirectionBottom(_this.props.direction) ||
          isDirectionTop(_this.props.direction)
            ? pageY
            : pageX;

        // reset NEW_POSITION and MOVING_POSITION
        _this.NEW_POSITION = 0;
        _this.MOVING_POSITION = 0;

        _this.setState(function() {
          return {
            thumb: start,
            start: start,
            touching: true
          };
        });
      }),
      (_this.drag = function(event) {
        var _this$props2 = _this.props,
          direction = _this$props2.direction,
          isDraggable = _this$props2.isDraggable;
        var _this$state = _this.state,
          thumb = _this$state.thumb,
          start = _this$state.start,
          position = _this$state.position;
        var _event$touches$2 = event.touches[0],
          pageY = _event$touches$2.pageY,
          pageX = _event$touches$2.pageX;

        var movingPosition =
          isDirectionBottom(direction) || isDirectionTop(direction)
            ? pageY
            : pageX;
        var delta = movingPosition - thumb;
        var newPosition = isDirectionBottom(direction)
          ? position + delta
          : position - delta;

        if (newPosition > 0 && _this.ALLOW_DRAWER_TRANSFORM && isDraggable) {
          // stop android's pull to refresh behavior
          event.preventDefault();

          _this.props.onDrag({ newPosition: newPosition });
          // we set this, so we can access it in shouldWeCloseDrawer. Since setState is async, we're not guranteed we'll have the
          // value in time
          _this.MOVING_POSITION = movingPosition;
          _this.NEW_POSITION = newPosition;

          var positionThreshold = 0;

          if (isDirectionRight(direction)) {
            positionThreshold = _this.drawer.scrollWidth;
          }

          if (newPosition < positionThreshold && _this.shouldWeCloseDrawer()) {
            _this.props.notifyWillClose(true);
          } else {
            _this.props.notifyWillClose(false);
          }

          // not at the bottom
          if (_this.NEGATIVE_SCROLL < newPosition) {
            _this.setState(function() {
              return {
                thumb: movingPosition,
                position:
                  positionThreshold > 0
                    ? Math.min(newPosition, positionThreshold)
                    : newPosition
              };
            });
          }
        }
      }),
      (_this.release = function(event) {
        var direction = _this.props.direction;

        _this.setState(function() {
          return {
            touching: false
          };
        });

        if (_this.shouldWeCloseDrawer()) {
          _this.hideDrawer();
        } else {
          var newPosition = 0;

          if (isDirectionRight(direction)) {
            newPosition = _this.drawer.scrollWidth;
          }

          _this.setState(function() {
            return {
              position: newPosition
            };
          });
        }
      }),
      (_this.getNegativeScroll = function(element) {
        var direction = _this.props.direction;

        var size = _this.getElementSize();

        if (isDirectionBottom(direction) || isDirectionTop(direction)) {
          _this.NEGATIVE_SCROLL =
            size - element.scrollHeight - _this.MAX_NEGATIVE_SCROLL;
        } else {
          _this.NEGATIVE_SCROLL =
            size - element.scrollWidth - _this.MAX_NEGATIVE_SCROLL;
        }
      }),
      (_this.hideDrawer = function() {
        var _this$props3 = _this.props,
          allowClose = _this$props3.allowClose,
          onRequestClose = _this$props3.onRequestClose,
          direction = _this$props3.direction;

        var defaultPosition = 0;

        if (isDirectionRight(direction)) {
          defaultPosition = _this.drawer.scrollWidth;
        }

        if (allowClose === false) {
          // if we aren't going to allow close, let's animate back to the default position
          return _this.setState(function() {
            return {
              position: defaultPosition,
              thumb: 0,
              touching: false
            };
          });
        }

        _this.setState(function() {
          return {
            position: defaultPosition,
            touching: false
          };
        });

        // cleanup
        _this.removeListeners();
        onRequestClose();
      }),
      (_this.shouldWeCloseDrawer = function() {
        var touchStart = _this.state.start;
        var direction = _this.props.direction;

        var initialPosition = 0;

        if (isDirectionRight(direction)) {
          initialPosition = _this.drawer.scrollWidth;
        }

        if (_this.MOVING_POSITION === initialPosition) return false;

        if (isDirectionRight(direction)) {
          return (
            _this.NEW_POSITION < initialPosition &&
            _this.MOVING_POSITION - touchStart > _this.SCROLL_TO_CLOSE
          );
        } else if (isDirectionLeft(direction)) {
          return (
            _this.NEW_POSITION >= initialPosition &&
            touchStart - _this.MOVING_POSITION > _this.SCROLL_TO_CLOSE
          );
        } else if (isDirectionTop(direction)) {
          return (
            _this.NEW_POSITION >= initialPosition &&
            touchStart - _this.MOVING_POSITION > _this.SCROLL_TO_CLOSE
          );
        } else {
          return (
            _this.NEW_POSITION >= initialPosition &&
            _this.MOVING_POSITION - touchStart > _this.SCROLL_TO_CLOSE
          );
        }
      }),
      (_this.getDrawerTransform = function(value) {
        var direction = _this.props.direction;

        if (isDirectionBottom(direction)) {
          return { transform: "translate3d(0, " + value + "px, 0)" };
        } else if (isDirectionTop(direction)) {
          return { transform: "translate3d(0, -" + value + "px, 0)" };
        } else if (isDirectionLeft(direction)) {
          return { transform: "translate3d(-" + value + "px, 0, 0)" };
        } else if (isDirectionRight(direction)) {
          return { transform: "translate3d(" + value + "px, 0, 0)" };
        }
      }),
      (_this.getElementSize = function() {
        if (isClientSide()) {
          return isDirectionBottom(_this.props.direction) ||
            isDirectionTop(_this.props.direction)
            ? window.innerHeight
            : window.innerWidth;
        }
      }),
      (_this.inViewportChange = function(inView) {
        _this.props.inViewportChange(inView);

        _this.ALLOW_DRAWER_TRANSFORM = inView;
      }),
      (_this.preventDefault = function(event) {
        return event.preventDefault();
      }),
      (_this.stopPropagation = function(event) {
        return event.stopPropagation();
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }

  Drawer.prototype.componentDidMount = function componentDidMount() {
    if (this.props.direction === "y")
      console.warn(
        "Direction prop is now takes up or down, y is no longer supported!"
      );
    if (this.props.direction === "x")
      console.warn(
        "Direction prop is now takes left or right, x is no longer supported!"
      );
  };

  Drawer.prototype.componentDidUpdate = function componentDidUpdate(
    prevProps,
    nextState
  ) {
    var _this2 = this;

    // in the process of closing the drawer
    if (!this.props.open && prevProps.open) {
      this.removeListeners();

      setTimeout(function() {
        _this2.setState(function() {
          return {
            open: false
          };
        });
      }, 300);
    }

    if (this.drawer) {
      this.getNegativeScroll(this.drawer);
    }

    // in the process of opening the drawer
    if (this.props.open && !prevProps.open) {
      this.props.onOpen();

      this.setState(function() {
        return {
          open: true
        };
      });
    }
  };

  Drawer.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeListeners();
  };

  Drawer.prototype.getPosition = function getPosition(hiddenPosition) {
    var position = this.state.position;
    var direction = this.props.direction;

    if (isDirectionRight(direction)) {
      return hiddenPosition - position;
    } else {
      return position;
    }
  };

  Drawer.prototype.render = function render() {
    var _this3 = this;

    var _props = this.props,
      containerElementClass = _props.containerElementClass,
      containerOpacity = _props.containerOpacity,
      dontApplyListeners = _props.dontApplyListeners,
      id = _props.id,
      getContainerRef = _props.getContainerRef,
      getModalRef = _props.getModalRef,
      direction = _props.direction;

    var open = this.state.open && this.props.open;

    // If drawer isn't open or in the process of opening/closing, then remove it from the DOM
    // also, if we're not client side we need to return early because createPortal is only
    // a clientside method
    if ((!this.state.open && !this.props.open) || !isClientSide()) {
      return null;
    }

    var touching = this.state.touching;

    var animationSpring = touching
      ? { damping: 20, stiffness: 300 }
      : presets.stiff;

    var hiddenPosition = this.getElementSize();

    var position = this.getPosition(hiddenPosition);

    // Style object for the container element
    var containerStyle = {
      backgroundColor: "rgba(55, 56, 56, " + (open ? containerOpacity : 0) + ")"
    };

    // If direction is right, we set the overflowX property to 'hidden' to hide the x scrollbar during
    // the sliding animation
    if (isDirectionRight(direction)) {
      containerStyle = _extends({}, containerStyle, {
        overflowX: "hidden"
      });
    }

    return createPortal(
      React.createElement(
        Motion,
        {
          style: {
            translate: spring(open ? position : hiddenPosition, animationSpring)
          },
          defaultStyle: {
            translate: hiddenPosition
          }
        },
        function(_ref) {
          var translate = _ref.translate;

          return React.createElement(
            "div",
            {
              id: id,
              style: containerStyle,
              onClick: _this3.hideDrawer,
              className: Container + " " + containerElementClass + " ",
              ref: getContainerRef
            },
            React.createElement(Observer, {
              className: HaveWeScrolled,
              onChange: _this3.inViewportChange
            }),
            React.createElement(
              "div",
              {
                onClick: _this3.stopPropagation,
                style: _this3.getDrawerTransform(translate),
                ref: _this3.attachListeners,
                className: _this3.props.modalElementClass || ""
              },
              _this3.props.children
            )
          );
        }
      ),
      this.props.parentElement
    );
  };

  return Drawer;
})(Component)),
(_class.defaultProps = {
  notifyWillClose: function notifyWillClose() {},
  onOpen: function onOpen() {},
  onDrag: function onDrag() {},
  inViewportChange: function inViewportChange() {},
  onRequestClose: function onRequestClose() {},
  getContainerRef: function getContainerRef() {},
  getModalRef: function getModalRef() {},
  containerOpacity: 0.6,
  direction: "bottom",
  parentElement: document.body,
  allowClose: true,
  dontApplyListeners: false,
  containerElementClass: "",
  modalElementClass: "",
  isDraggable: true
}),
_temp2);
export { Drawer as default };
Drawer.propTypes =
  process.env.NODE_ENV !== "production"
    ? {
        open: PropTypes.bool.isRequired,
        children: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.array,
          PropTypes.element
        ]),
        onRequestClose: PropTypes.func,
        onDrag: PropTypes.func,
        onOpen: PropTypes.func,
        inViewportChange: PropTypes.func,
        allowClose: PropTypes.bool,
        notifyWillClose: PropTypes.func,
        direction: PropTypes.string,
        modalElementClass: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.string
        ]),
        containerOpacity: PropTypes.number,
        containerElementClass: PropTypes.string,
        getContainerRef: PropTypes.func,
        getModalRef: PropTypes.func,
        isDraggable: PropTypes.bool
      }
    : {};

var Container = css(_templateObject);

var HaveWeScrolled = css(_templateObject2);
